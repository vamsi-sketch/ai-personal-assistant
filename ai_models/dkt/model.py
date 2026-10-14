"""
Deep Knowledge Tracing (DKT) with LSTM in PyTorch
Architecture:
Input: Interaction tuple (Topic_id, Correctness, Difficulty)
Input Encoding -> Linear/Embedding Layer -> LSTM Layer -> Dropout -> Fully Connected -> Sigmoid
Output: Topic Mastery Probabilities for all topics at time t+1
"""

import torch
import torch.nn as nn

class DeepKnowledgeTracingLSTM(nn.Module):
    def __init__(self, num_topics: int = 50, embedding_dim: int = 64, hidden_dim: int = 128, num_layers: int = 1, dropout: float = 0.2):
        super(DeepKnowledgeTracingLSTM, self).__init__()
        self.num_topics = num_topics
        self.embedding_dim = embedding_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # Input features per interaction:
        # topic_id (one-hot or embedding), correctness (0 or 1), difficulty (0: easy, 1: medium, 2: hard)
        # We encode: (topic_id * 2 + correctness) as the interaction token, plus difficulty embedding
        self.interaction_embedding = nn.Embedding(num_topics * 2 + 1, embedding_dim)
        self.difficulty_embedding = nn.Embedding(4, 16) # 0: unk, 1: easy, 2: medium, 3: hard
        
        input_dim = embedding_dim + 16
        
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0
        )
        
        self.dropout = nn.Dropout(dropout)
        # Linear layer outputs mastery probability for each of the topics
        self.fc = nn.Linear(hidden_dim, num_topics)
        self.sigmoid = nn.Sigmoid()

    def forward(self, interaction_tokens, difficulty_tokens, lengths=None):
        """
        interaction_tokens: [batch_size, seq_len]
        difficulty_tokens: [batch_size, seq_len]
        Returns:
            mastery_logits: [batch_size, seq_len, num_topics]
            mastery_probs: [batch_size, seq_len, num_topics]
        """
        inter_embed = self.interaction_embedding(interaction_tokens)
        diff_embed = self.difficulty_embedding(difficulty_tokens)
        
        combined_input = torch.cat([inter_embed, diff_embed], dim=-1)
        
        lstm_out, _ = self.lstm(combined_input)
        lstm_out = self.dropout(lstm_out)
        
        logits = self.fc(lstm_out)
        probs = self.sigmoid(logits)
        return logits, probs

    def predict_next_mastery(self, interaction_history):
        """
        Single student inference:
        interaction_history: list of dicts with {'topic_id': int, 'correct': bool, 'difficulty': int}
        Returns: dict mapping topic_id -> mastery_prob (0.0 to 1.0)
        """
        self.eval()
        if not interaction_history:
            # Default prior mastery if no history
            return {t: 0.5 for t in range(self.num_topics)}
            
        seq_inter = []
        seq_diff = []
        for item in interaction_history:
            t_id = min(item.get('topic_id', 0), self.num_topics - 1)
            correct = 1 if item.get('correct', False) else 0
            token = (t_id * 2) + correct + 1
            diff = item.get('difficulty_code', 2) # default medium
            seq_inter.append(token)
            seq_diff.append(diff)
            
        inter_tensor = torch.tensor([seq_inter], dtype=torch.long)
        diff_tensor = torch.tensor([seq_diff], dtype=torch.long)
        
        with torch.no_grad():
            _, probs = self.forward(inter_tensor, diff_tensor)
            # Take last timestep's predictions
            last_probs = probs[0, -1, :].cpu().numpy().tolist()
            
        return {t: round(float(last_probs[t]), 4) for t in range(self.num_topics)}
