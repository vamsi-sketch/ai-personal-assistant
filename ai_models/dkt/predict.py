"""
Inference service for Deep Knowledge Tracing
Loads trained PyTorch DKT model checkpoint and predicts real-time topic mastery.
"""

import os
import torch
from ai_models.dkt.model import DeepKnowledgeTracingLSTM

class DKTPredictor:
    def __init__(self, model_path: str = "ai_models/trained_models/dkt_model.pth", num_topics: int = 20):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.num_topics = num_topics
        self.model = DeepKnowledgeTracingLSTM(num_topics=num_topics, embedding_dim=64, hidden_dim=128).to(self.device)
        self.is_loaded = False
        
        if os.path.exists(model_path):
            try:
                checkpoint = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(checkpoint['model_state_dict'])
                self.is_loaded = True
                print(f"Loaded trained DKT checkpoint from {model_path} (Val Acc: {checkpoint.get('val_accuracy', 0):.2%})")
            except Exception as e:
                print(f"Warning: Could not load DKT weights ({e}). Initializing fresh model.")
        else:
            print(f"Notice: DKT checkpoint {model_path} not found. Running with initialized weights.")
            
        self.model.eval()

    def predict_mastery_from_interactions(self, interactions, topic_map=None):
        """
        interactions: list of dicts: [{'topic_id': int, 'correct': bool, 'difficulty': int}]
        topic_map: optional dict mapping topic_id -> topic_name
        Returns dict: {topic_name/topic_id: mastery_float_0_to_1}
        """
        raw_mastery = self.model.predict_next_mastery(interactions)
        
        if topic_map:
            result = {}
            for t_id, prob in raw_mastery.items():
                if t_id in topic_map:
                    result[topic_map[t_id]] = prob
            return result
        return raw_mastery
