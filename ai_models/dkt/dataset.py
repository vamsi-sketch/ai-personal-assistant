"""
PyTorch Dataset and Sequence Batching for DKT
Compatible with ASSISTments 2009-2010 skill builder / student interaction format.
"""

import torch
from torch.utils.data import Dataset
import numpy as np

class DKTInteractionDataset(Dataset):
    def __init__(self, sequences, max_seq_len: int = 100, num_topics: int = 50):
        """
        sequences: list of student sequences
        Each sequence: list of (topic_id, correct, difficulty)
        """
        self.sequences = sequences
        self.max_seq_len = max_seq_len
        self.num_topics = num_topics

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        seq = self.sequences[idx]
        seq_len = min(len(seq), self.max_seq_len)
        seq = seq[-self.max_seq_len:]
        
        inter_tokens = np.zeros(self.max_seq_len, dtype=np.int64)
        diff_tokens = np.zeros(self.max_seq_len, dtype=np.int64)
        target_topics = np.zeros(self.max_seq_len, dtype=np.int64)
        target_correct = np.zeros(self.max_seq_len, dtype=np.float32)
        mask = np.zeros(self.max_seq_len, dtype=np.float32)

        for t in range(seq_len):
            topic_id, correct, diff = seq[t]
            t_id = min(int(topic_id), self.num_topics - 1)
            corr_val = 1 if correct else 0
            
            # (topic * 2 + correctness) + 1 (1-indexed, 0 is padding)
            inter_tokens[t] = (t_id * 2) + corr_val + 1
            diff_tokens[t] = min(max(int(diff), 1), 3)
            
            target_topics[t] = t_id
            target_correct[t] = float(corr_val)
            mask[t] = 1.0

        return {
            'inter_tokens': torch.tensor(inter_tokens, dtype=torch.long),
            'diff_tokens': torch.tensor(diff_tokens, dtype=torch.long),
            'target_topics': torch.tensor(target_topics, dtype=torch.long),
            'target_correct': torch.tensor(target_correct, dtype=torch.float32),
            'mask': torch.tensor(mask, dtype=torch.float32),
            'seq_len': seq_len
        }

def generate_synthetic_assistments_data(num_students=200, num_topics=20, min_seq=10, max_seq=60):
    """
    Generates realistic student knowledge trajectories for training and college demonstration.
    Models latent knowledge acquisition with learning rate and slip/guess parameters.
    """
    np.random.seed(42)
    students_data = []
    
    # Topic intrinsic difficulties (0.3 = hard, 0.8 = easy)
    topic_base_easiness = np.random.uniform(0.35, 0.85, size=num_topics)
    
    for _ in range(num_students):
        student_ability = np.random.normal(0.0, 0.5)
        # Latent mastery per topic for this student
        student_mastery = np.clip(topic_base_easiness + student_ability * 0.2, 0.1, 0.9)
        seq_len = np.random.randint(min_seq, max_seq + 1)
        
        seq = []
        for _ in range(seq_len):
            topic = np.random.randint(0, num_topics)
            # Question difficulty: 1: easy, 2: medium, 3: hard
            difficulty = np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2])
            
            # Probability of answering correctly given mastery and difficulty
            diff_penalty = (difficulty - 2) * 0.15
            p_correct = np.clip(student_mastery[topic] - diff_penalty, 0.05, 0.95)
            correct = bool(np.random.rand() < p_correct)
            
            seq.append((topic, correct, difficulty))
            
            # Knowledge update (learning step)
            learning_gain = 0.08 if correct else 0.03
            student_mastery[topic] = min(0.98, student_mastery[topic] + learning_gain)
            
        students_data.append(seq)
        
    return students_data
