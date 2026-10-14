"""
Unit test for LSTM-based Deep Knowledge Tracing
Verifies tensor dimensions, forward pass, and mastery probability constraints [0.0, 1.0].
"""

import unittest
import torch
from ai_models.dkt.model import DeepKnowledgeTracingLSTM
from ai_models.dkt.dataset import generate_synthetic_assistments_data, DKTInteractionDataset

class TestDKTModel(unittest.TestCase):
    def setUp(self):
        self.num_topics = 10
        self.model = DeepKnowledgeTracingLSTM(num_topics=self.num_topics, embedding_dim=32, hidden_dim=64)

    def test_forward_dimensions(self):
        batch_size = 4
        seq_len = 8
        # random tokens within vocabulary
        inter_tokens = torch.randint(1, self.num_topics * 2 + 1, (batch_size, seq_len))
        diff_tokens = torch.randint(1, 4, (batch_size, seq_len))
        
        logits, probs = self.model(inter_tokens, diff_tokens)
        
        self.assertEqual(logits.shape, (batch_size, seq_len, self.num_topics))
        self.assertEqual(probs.shape, (batch_size, seq_len, self.num_topics))
        
        # Verify probability bounds
        self.assertTrue((probs >= 0.0).all())
        self.assertTrue((probs <= 1.0).all())

    def test_single_student_inference(self):
        history = [
            {"topic_id": 0, "correct": True, "difficulty_code": 1},
            {"topic_id": 0, "correct": True, "difficulty_code": 2},
            {"topic_id": 1, "correct": False, "difficulty_code": 2}
        ]
        mastery = self.model.predict_next_mastery(history)
        self.assertEqual(len(mastery), self.num_topics)
        for t_id, p in mastery.items():
            self.assertGreaterEqual(p, 0.0)
            self.assertLessEqual(p, 1.0)

if __name__ == "__main__":
    unittest.main()
