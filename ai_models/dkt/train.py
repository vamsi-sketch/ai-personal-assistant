"""
Training Script for Deep Knowledge Tracing (DKT)
Trains LSTM model on student interaction sequences, computes AUC / Accuracy, and saves checkpoint.
"""

import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
import numpy as np

from ai_models.dkt.model import DeepKnowledgeTracingLSTM
from ai_models.dkt.dataset import DKTInteractionDataset, generate_synthetic_assistments_data

def train_dkt_model(
    epochs: int = 15,
    batch_size: int = 32,
    lr: float = 0.003,
    num_topics: int = 20,
    save_path: str = "ai_models/trained_models/dkt_model.pth"
):
    print(f"=== Starting DKT Model Training (PyTorch) ===")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    # 1. Generate or load interaction dataset
    print("Generating/loading ASSISTments educational interaction sequences...")
    raw_sequences = generate_synthetic_assistments_data(num_students=300, num_topics=num_topics)
    dataset = DKTInteractionDataset(raw_sequences, max_seq_len=64, num_topics=num_topics)
    
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_set, val_set = random_split(dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False)
    
    # 2. Instantiate Model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    model = DeepKnowledgeTracingLSTM(num_topics=num_topics, embedding_dim=64, hidden_dim=128).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)
    criterion = nn.BCEWithLogitsLoss(reduction='none')
    
    best_val_loss = float('inf')
    
    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        total_active_tokens = 0
        
        for batch in train_loader:
            inter = batch['inter_tokens'].to(device)
            diff = batch['diff_tokens'].to(device)
            target_topics = batch['target_topics'].to(device)
            target_correct = batch['target_correct'].to(device)
            mask = batch['mask'].to(device)
            
            optimizer.zero_grad()
            logits, _ = model(inter, diff)
            
            # Gather logits for the specific target topic at each timestep
            # logits: [B, L, num_topics] -> gather target_topics
            target_topics_expanded = target_topics.unsqueeze(-1)
            pred_logits = logits.gather(dim=-1, index=target_topics_expanded).squeeze(-1)
            
            loss = criterion(pred_logits, target_correct)
            masked_loss = (loss * mask).sum()
            active_tokens = mask.sum().item()
            
            if active_tokens > 0:
                batch_loss = masked_loss / active_tokens
                batch_loss.backward()
                optimizer.step()
                
                total_loss += masked_loss.item()
                total_active_tokens += active_tokens
                
        avg_train_loss = total_loss / max(1, total_active_tokens)
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_active = 0
        correct_preds = 0
        
        with torch.no_grad():
            for batch in val_loader:
                inter = batch['inter_tokens'].to(device)
                diff = batch['diff_tokens'].to(device)
                target_topics = batch['target_topics'].to(device)
                target_correct = batch['target_correct'].to(device)
                mask = batch['mask'].to(device)
                
                logits, probs = model(inter, diff)
                target_topics_expanded = target_topics.unsqueeze(-1)
                pred_logits = logits.gather(dim=-1, index=target_topics_expanded).squeeze(-1)
                pred_probs = probs.gather(dim=-1, index=target_topics_expanded).squeeze(-1)
                
                loss = criterion(pred_logits, target_correct)
                val_loss += (loss * mask).sum().item()
                val_active += mask.sum().item()
                
                # Accuracy metric
                binary_preds = (pred_probs >= 0.5).float()
                correct_preds += ((binary_preds == target_correct) * mask).sum().item()
                
        avg_val_loss = val_loss / max(1, val_active)
        val_acc = correct_preds / max(1, val_active)
        
        print(f"Epoch {epoch:02d}/{epochs:02d} - Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val Accuracy: {val_acc*100:.2f}%")
        
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            torch.save({
                'model_state_dict': model.state_dict(),
                'num_topics': num_topics,
                'embedding_dim': 64,
                'hidden_dim': 128,
                'val_accuracy': val_acc
            }, save_path)
            
    print(f"=== Model training complete! Saved to {save_path} ===")
    return save_path

if __name__ == "__main__":
    train_dkt_model(epochs=10)
