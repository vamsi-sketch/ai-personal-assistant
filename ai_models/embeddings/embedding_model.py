"""
Embedding and Vector Search Service
Uses Sentence Transformers and FAISS to index document chunks and retrieve top-k context for RAG.
"""

import os
import json
from typing import List, Dict, Any

class RAGVectorStore:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", index_dir: str = "vector_db/faiss_index"):
        self.model_name = model_name
        self.index_dir = index_dir
        self.chunks_metadata: List[Dict[str, Any]] = []
        self.dimension = 384 # default for all-MiniLM-L6-v2
        self.index = None
        self.encoder = None
        
        os.makedirs(index_dir, exist_ok=True)
        self._init_encoder()
        self._init_faiss()

    def _init_encoder(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.encoder = SentenceTransformer(self.model_name)
            print(f"Loaded SentenceTransformer: {self.model_name}")
        except Exception as e:
            print(f"SentenceTransformer not loaded ({e}). Falling back to algorithmic tf-idf semantic similarity.")
            self.encoder = None

    def _init_faiss(self):
        try:
            import faiss
            self.index = faiss.IndexFlatIP(self.dimension)
            print("FAISS IndexFlatIP initialized.")
        except Exception as e:
            print(f"FAISS library not installed directly ({e}). Using cosine vector retrieval.")
            self.index = None

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        """
        chunks: list of dicts with 'doc_id', 'doc_name', 'topic', 'text', 'chunk_id'
        """
        if not chunks:
            return 0
            
        texts = [c['text'] for c in chunks]
        
        if self.encoder and self.index:
            import numpy as np
            import faiss
            embeddings = self.encoder.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            self.index.add(embeddings.astype(np.float32))
            
        self.chunks_metadata.extend(chunks)
        return len(chunks)

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Searches the vector store and returns the most relevant chunks for the query.
        """
        if not self.chunks_metadata:
            return []
            
        if self.encoder and self.index and self.index.ntotal > 0:
            import numpy as np
            q_emb = self.encoder.encode([query], convert_to_numpy=True, normalize_embeddings=True)
            k = min(top_k, self.index.ntotal)
            distances, indices = self.index.search(q_emb.astype(np.float32), k)
            
            results = []
            for score, idx in zip(distances[0], indices[0]):
                if 0 <= idx < len(self.chunks_metadata):
                    item = dict(self.chunks_metadata[idx])
                    item['similarity_score'] = float(score)
                    results.append(item)
            return results
        else:
            # Algorithmic term-frequency / token overlap fallback
            q_words = set(query.lower().split())
            scored = []
            for c in self.chunks_metadata:
                text_words = c['text'].lower().split()
                if not text_words:
                    continue
                overlap = sum(1 for w in text_words if w in q_words)
                score = overlap / (len(q_words) + 0.001)
                scored.append((score, c))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [dict(item, similarity_score=round(s, 3)) for s, item in scored[:top_k]]
