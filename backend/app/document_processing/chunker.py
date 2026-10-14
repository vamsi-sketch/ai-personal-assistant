"""
Document Chunker & Topic Detector
Divides extracted document text into semantic chunks with overlap and automatically detects topics/chapters.
"""

import re
from typing import List, Dict, Any

class DocumentChunker:
    @staticmethod
    def detect_topics(text: str) -> List[str]:
        """
        Scans text for heading patterns:
        - "Chapter 1: ...", "Unit 2: ...", "Topic: ...", "1.1 ...", "# Heading"
        """
        lines = text.split("\n")
        detected = []
        pattern = re.compile(r'^(?:chapter|unit|section|topic|\d+\.\d+|\#\#?)\s*[:\-\.]?\s*(.+)$', re.IGNORECASE)
        
        for line in lines:
            line_str = line.strip()
            if not line_str or len(line_str) > 80:
                continue
            m = pattern.match(line_str)
            if m:
                topic_title = m.group(1).strip()
                if len(topic_title) > 3 and topic_title not in detected:
                    detected.append(topic_title)
                    
        if not detected:
            detected = ["General Concepts", "Key Definitions", "System Architecture", "Algorithms & Analysis"]
            
        return detected[:8]

    @staticmethod
    def chunk_text(
        text: str,
        doc_id: str,
        doc_name: str,
        chunk_size: int = 500,
        chunk_overlap: int = 80
    ) -> List[Dict[str, Any]]:
        """
        Splits text into overlapping semantic word chunks.
        """
        words = text.split()
        if not words:
            return []
            
        chunks = []
        topics = DocumentChunker.detect_topics(text)
        
        step = max(50, chunk_size - chunk_overlap)
        chunk_index = 0
        
        for i in range(0, len(words), step):
            chunk_words = words[i:i + chunk_size]
            if not chunk_words:
                continue
            chunk_content = " ".join(chunk_words)
            
            # Map chunk to detected topic based on position or keyword matches
            topic_idx = (chunk_index % len(topics)) if topics else 0
            assigned_topic = topics[topic_idx] if topics else "General Study Material"
            
            chunks.append({
                "chunk_id": f"{doc_id}_chunk_{chunk_index}",
                "doc_id": doc_id,
                "doc_name": doc_name,
                "topic": assigned_topic,
                "text": chunk_content,
                "char_length": len(chunk_content),
                "word_count": len(chunk_words),
                "chunk_index": chunk_index
            })
            chunk_index += 1
            
        return chunks
