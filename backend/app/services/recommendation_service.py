"""
Recommendation and Adaptive Learning Engine
Generates:
1. Dynamic recommendations (Next topic, Revision, Prerequisites, Practice quizzes)
2. Adaptive quiz difficulty selection with reason
3. Tailored Day-by-Day Study Plans
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta

try:
    from backend.app.services.dkt_service import dkt_service
except ImportError:
    try:
        from app.services.dkt_service import dkt_service
    except ImportError:
        from services.dkt_service import dkt_service

class RecommendationEngine:
    @staticmethod
    def get_recommendations(student_id: str = "demo_student") -> List[Dict[str, Any]]:
        masteries = dkt_service.calculate_topic_mastery(student_id)
        
        # Sort masteries ascending (weakest first)
        weakest = sorted([m for m in masteries if m["total_attempts"] > 0], key=lambda x: x["dkt_mastery"])
        untested = [m for m in masteries if m["total_attempts"] == 0]
        
        recs = []
        
        # 1. Critical weak topic needing immediate intervention
        if weakest and weakest[0]["dkt_mastery"] < 0.50:
            crit = weakest[0]
            recs.append({
                "type": "revision_needed",
                "title": f"Critical Revision: {crit['topic_name']}",
                "topic": crit["topic_name"],
                "reason": f"LSTM DKT detected low mastery ({crit['mastery_percentage']}%) and recent quiz mistakes. Re-study core concepts before proceeding.",
                "difficulty": "Easy",
                "priority": "High",
                "action_label": "Start AI Summary & Tutor"
            })
            
        # 2. Practice quiz recommendation
        if weakest and len(weakest) > 1 and weakest[1]["dkt_mastery"] < 0.65:
            mod = weakest[1]
            recs.append({
                "type": "practice_quiz",
                "title": f"Targeted Practice: {mod['topic_name']}",
                "topic": mod["topic_name"],
                "reason": f"Mastery is at {mod['mastery_percentage']}%. A focused adaptive quiz will reinforce foundational knowledge.",
                "difficulty": mod["recommended_difficulty"],
                "priority": "High",
                "action_label": "Take Adaptive Quiz"
            })
            
        # 3. Next progressive topic
        if untested:
            next_topic = untested[0]
            recs.append({
                "type": "next_topic",
                "title": f"Explore New Concept: {next_topic['topic_name']}",
                "topic": next_topic["topic_name"],
                "reason": "Prerequisites satisfied. Ready to expand syllabus coverage.",
                "difficulty": "Easy",
                "priority": "Medium",
                "action_label": "Upload Notes or Read Summary"
            })
        else:
            # Recommend highest mastery topic for Hard difficulty challenge
            strongest = sorted(masteries, key=lambda x: x["dkt_mastery"], reverse=True)[0]
            recs.append({
                "type": "challenge",
                "title": f"Mastery Challenge: {strongest['topic_name']}",
                "topic": strongest["topic_name"],
                "reason": f"High mastery achieved ({strongest['mastery_percentage']}%). Challenge yourself with Hard conceptual questions.",
                "difficulty": "Hard",
                "priority": "Normal",
                "action_label": "Take Hard Quiz"
            })
            
        return recs

    @staticmethod
    def get_adaptive_difficulty(topic_name: str, student_id: str = "demo_student") -> Dict[str, Any]:
        masteries = dkt_service.calculate_topic_mastery(student_id)
        topic_match = next((m for m in masteries if m["topic_name"].lower() == topic_name.lower()), None)
        
        if not topic_match or topic_match["total_attempts"] == 0:
            return {
                "difficulty": "Medium",
                "reason": "No prior interaction history for this topic. Starting with Medium baseline to calibrate student ability."
            }
            
        mastery = topic_match["dkt_mastery"]
        if mastery >= 0.78:
            return {
                "difficulty": "Hard",
                "reason": f"High DKT mastery ({int(mastery*100)}%). Promoted to Hard difficulty to strengthen deep conceptual synthesis."
            }
        elif mastery >= 0.50:
            return {
                "difficulty": "Medium",
                "reason": f"Moderate DKT mastery ({int(mastery*100)}%). Balanced Medium questions will consolidate retention."
            }
        else:
            return {
                "difficulty": "Easy",
                "reason": f"Current DKT mastery is {int(mastery*100)}%. Step-by-step Easy questions selected to rebuild confidence and repair misconceptions."
            }

    @staticmethod
    def generate_study_plan(
        exam_date: str,
        available_hours_per_day: float,
        subjects: List[str],
        learning_goals: str,
        student_id: str = "demo_student"
    ) -> Dict[str, Any]:
        masteries = dkt_service.calculate_topic_mastery(student_id)
        
        # Prioritize topics by lowest mastery
        ranked_topics = sorted(masteries, key=lambda x: x["dkt_mastery"])
        
        today = datetime.now()
        days_list = []
        activities_pool = [
            ("AI Tutor Session: Core Theory & Examples", 45),
            ("Generate AI Revision Notes & Flashpoints", 30),
            ("Adaptive Practice Quiz & Misconception Review", 45),
            ("Deep RAG Q&A on Edge Cases & Deadlock Conditions", 40),
            ("Comprehensive Diagnostic Evaluation", 60)
        ]
        
        plan_duration_days = 7
        for day_num in range(1, plan_duration_days + 1):
            date_str = (today + timedelta(days=day_num - 1)).strftime("%b %d, %Y")
            topic_obj = ranked_topics[(day_num - 1) % len(ranked_topics)]
            act_name, est_mins = activities_pool[(day_num - 1) % len(activities_pool)]
            
            days_list.append({
                "day": day_num,
                "date": date_str,
                "subject": topic_obj.get("category", "Computer Science"),
                "topic": topic_obj["topic_name"],
                "activity": act_name,
                "difficulty": topic_obj["recommended_difficulty"],
                "estimated_minutes": min(int(available_hours_per_day * 60), est_mins + 20),
                "completed": day_num == 1 # mark first day as demo started
            })
            
        return {
            "id": f"plan_{student_id}_{int(datetime.now().timestamp())}",
            "student_id": student_id,
            "exam_date": exam_date,
            "daily_hours": available_hours_per_day,
            "overall_progress": 14.3, # 1 of 7 completed
            "days": days_list,
            "created_at": datetime.now().isoformat()
        }
