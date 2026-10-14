"""
DKT Service
Maintains the student knowledge trajectory and evaluates knowledge tracing.
"""

from typing import List, Dict, Any
import numpy as np

# Core Topic Ontology for College Demonstration
CURRICULUM_TOPICS = [
    {"id": 0, "name": "Processes & Threads", "category": "Operating Systems"},
    {"id": 1, "name": "CPU Scheduling", "category": "Operating Systems"},
    {"id": 2, "name": "Process Synchronization", "category": "Operating Systems"},
    {"id": 3, "name": "Deadlocks", "category": "Operating Systems"},
    {"id": 4, "name": "Memory Management & Paging", "category": "Operating Systems"},
    {"id": 5, "name": "Virtual Memory & Page Replacement", "category": "Operating Systems"},
    {"id": 6, "name": "File Systems & Disk Scheduling", "category": "Operating Systems"},
    {"id": 7, "name": "Binary Search Trees & AVL", "category": "Data Structures"},
    {"id": 8, "name": "Dynamic Programming", "category": "Algorithms"},
    {"id": 9, "name": "Graph Traversal (BFS/DFS)", "category": "Algorithms"}
]

TOPIC_NAME_TO_ID = {t["name"].lower(): t["id"] for t in CURRICULUM_TOPICS}
TOPIC_ID_TO_NAME = {t["id"]: t["name"] for t in CURRICULUM_TOPICS}

def resolve_topic_id(topic_name: str) -> int:
    name_clean = topic_name.lower().strip()
    for k, v in TOPIC_NAME_TO_ID.items():
        if k in name_clean or name_clean in k:
            return v
    return 0

class DKTService:
    def __init__(self):
        # Initial priors for demonstration student
        self.student_interactions: Dict[str, List[Dict[str, Any]]] = {}
        # Pre-seed initial history so that student dashboard has realistic, high-fidelity DKT metrics
        self._seed_default_student("demo_student")

    def _seed_default_student(self, student_id: str):
        # Realistic initial interaction sequence:
        # Strong at CPU Scheduling & Processes, but failing Deadlocks and Synchronization
        self.student_interactions[student_id] = [
            {"topic_id": 0, "topic_name": "Processes & Threads", "correct": True, "difficulty": "Easy", "difficulty_code": 1},
            {"topic_id": 0, "topic_name": "Processes & Threads", "correct": True, "difficulty": "Medium", "difficulty_code": 2},
            {"topic_id": 1, "topic_name": "CPU Scheduling", "correct": True, "difficulty": "Medium", "difficulty_code": 2},
            {"topic_id": 1, "topic_name": "CPU Scheduling", "correct": True, "difficulty": "Hard", "difficulty_code": 3},
            {"topic_id": 2, "topic_name": "Process Synchronization", "correct": False, "difficulty": "Medium", "difficulty_code": 2},
            {"topic_id": 2, "topic_name": "Process Synchronization", "correct": True, "difficulty": "Easy", "difficulty_code": 1},
            {"topic_id": 3, "topic_name": "Deadlocks", "correct": False, "difficulty": "Medium", "difficulty_code": 2},
            {"topic_id": 3, "topic_name": "Deadlocks", "correct": False, "difficulty": "Hard", "difficulty_code": 3},
            {"topic_id": 3, "topic_name": "Deadlocks", "correct": False, "difficulty": "Easy", "difficulty_code": 1},
            {"topic_id": 4, "topic_name": "Memory Management & Paging", "correct": True, "difficulty": "Medium", "difficulty_code": 2},
        ]

    def record_interaction(self, student_id: str, topic_name: str, correct: bool, difficulty: str):
        if student_id not in self.student_interactions:
            self.student_interactions[student_id] = []
            
        t_id = resolve_topic_id(topic_name)
        diff_code = {"easy": 1, "medium": 2, "hard": 3}.get(difficulty.lower(), 2)
        
        interaction = {
            "topic_id": t_id,
            "topic_name": TOPIC_ID_TO_NAME.get(t_id, topic_name),
            "correct": correct,
            "difficulty": difficulty,
            "difficulty_code": diff_code
        }
        self.student_interactions[student_id].append(interaction)
        return interaction

    def calculate_topic_mastery(self, student_id: str = "demo_student") -> List[Dict[str, Any]]:
        """
        Deep Knowledge Tracing calculation:
        Uses the sequence of past attempts, time-weighted recency, and difficulty penalties.
        """
        history = self.student_interactions.get(student_id, [])
        mastery_results = []
        
        for topic in CURRICULUM_TOPICS:
            t_id = topic["id"]
            t_name = topic["name"]
            
            # Filter student interactions on this topic
            attempts = [item for item in history if item["topic_id"] == t_id]
            
            if not attempts:
                # Prior prior
                prob = 0.50
                acc = 0.0
                status = "Untested"
                rec_diff = "Easy"
            else:
                correct_count = sum(1 for a in attempts if a["correct"])
                acc = correct_count / len(attempts)
                
                # Recency-weighted LSTM emulation:
                # Recent attempts contribute exponentially more to current knowledge state
                weights = [1.25 ** i for i in range(len(attempts))]
                weighted_sum = sum(w * (1.0 if a["correct"] else 0.0) for w, a in zip(weights, attempts))
                dkt_val = weighted_sum / sum(weights)
                
                # Factor in difficulty bonuses / penalties
                avg_diff_code = sum(a.get("difficulty_code", 2) for a in attempts) / len(attempts)
                diff_multiplier = 0.9 + (avg_diff_code - 1) * 0.1 # 0.9 for easy, 1.0 for med, 1.1 for hard
                
                prob = float(np.clip(dkt_val * diff_multiplier, 0.10, 0.98))
                
                if prob >= 0.78:
                    status = "Strong"
                    rec_diff = "Hard"
                elif prob >= 0.58:
                    status = "Moderate"
                    rec_diff = "Medium"
                elif prob >= 0.40:
                    status = "Weak"
                    rec_diff = "Medium"
                else:
                    status = "Critical"
                    rec_diff = "Easy"
                    
            mastery_results.append({
                "topic_id": t_id,
                "topic_name": t_name,
                "category": topic["category"],
                "dkt_mastery": round(prob, 3),
                "mastery_percentage": int(round(prob * 100)),
                "accuracy": round(acc, 2),
                "total_attempts": len(attempts),
                "status": status,
                "recommended_difficulty": rec_diff
            })
            
        return mastery_results

dkt_service = DKTService()
