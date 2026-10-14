"""
RAG Service using Sentence Transformers, FAISS, and Google GenAI LLM.
"""

import os
import sys
from typing import List, Dict, Any

# Ensure project root is in path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if ROOT_DIR and ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from ai_models.embeddings.embedding_model import RAGVectorStore

vector_store = RAGVectorStore()

# Default core curriculum knowledge chunks to ensure tutor is immediately intelligent
DEFAULT_CHUNKS = [
    {
        "chunk_id": "core_os_1",
        "doc_id": "doc_os_core",
        "doc_name": "Operating_Systems_Fundamentals.pdf",
        "topic": "Deadlocks",
        "text": "A deadlock occurs in concurrent computing when a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. The four Coffman conditions for deadlock are: 1. Mutual Exclusion (only one process can use a resource at a time), 2. Hold and Wait (processes hold allocated resources while waiting for new ones), 3. No Preemption (resources cannot be forcibly confiscated), 4. Circular Wait (a closed chain of processes exists such that each holds at least one resource needed by the next)."
    },
    {
        "chunk_id": "core_os_2",
        "doc_id": "doc_os_core",
        "doc_name": "Operating_Systems_Fundamentals.pdf",
        "topic": "Deadlocks",
        "text": "Deadlock handling strategies include: 1. Deadlock Prevention: Negating at least one of the four Coffman conditions (e.g., ordering resource acquisition numbers to eliminate circular wait). 2. Deadlock Avoidance: Using algorithms like Dijkstra's Banker's Algorithm that ensure the system never enters an unsafe state. 3. Deadlock Detection and Recovery: Periodically running wait-for graph cycle detection and terminating processes or preempting resources. 4. Ostrich Algorithm: Ignoring the problem if deadlocks occur rarely."
    },
    {
        "chunk_id": "core_os_3",
        "doc_id": "doc_os_core",
        "doc_name": "Operating_Systems_Fundamentals.pdf",
        "topic": "CPU Scheduling",
        "text": "CPU Scheduling algorithms determine which process in the ready queue is allocated the CPU by the short-term scheduler (dispatcher). Primary algorithms: 1. First-Come, First-Served (FCFS): Non-preemptive, suffers from the Convoy Effect. 2. Shortest Job First (SJF) and Shortest Remaining Time First (SRTF): Provably optimal for minimizing average waiting time, but susceptible to starvation of long tasks. 3. Round Robin (RR): Preemptive using time quantums; crucial trade-off: small quantum increases context-switch overhead, large quantum approaches FCFS. 4. Priority Scheduling: High priority executed first; solved with aging to prevent starvation."
    },
    {
        "chunk_id": "core_os_4",
        "doc_id": "doc_os_core",
        "doc_name": "Operating_Systems_Fundamentals.pdf",
        "topic": "Process Synchronization",
        "text": "Process synchronization coordinates concurrent execution of processes to prevent race conditions on shared memory. The Critical Section Problem requires three conditions: Mutual Exclusion, Progress, and Bounded Waiting. Classic hardware solutions include Test-and-Set and Compare-and-Swap instructions. Software primitives include Mutex Locks, Semaphores (Counting and Binary), and Monitors. Classic synchronization problems: Producer-Consumer (Bounded Buffer), Readers-Writers problem, and Dining Philosophers problem."
    },
    {
        "chunk_id": "core_os_5",
        "doc_id": "doc_os_core",
        "doc_name": "Operating_Systems_Fundamentals.pdf",
        "topic": "Memory Management & Paging",
        "text": "Virtual Memory separates user logical memory from physical memory. Paging maps logical addresses divided into pages to physical memory frames via a Page Table. Page faults occur when a referenced page is not in physical RAM, triggering page replacement. Classic page replacement algorithms include FIFO (which suffers from Belady's Anomaly), Optimal (OPT), and Least Recently Used (LRU) implemented with counters or stacks. Translation Lookaside Buffer (TLB) acts as a high-speed hardware cache to speed up address translation."
    }
]

# Initialize default chunks into FAISS vector store
vector_store.add_chunks(DEFAULT_CHUNKS)

def get_rag_context(query: str, top_k: int = 3) -> Dict[str, Any]:
    retrieved = vector_store.search(query, top_k=top_k)
    context_text = "\n\n".join([f"[Source: {r['doc_name']} | Topic: {r['topic']}]\n{r['text']}" for r in retrieved])
    sources = list(set([r['doc_name'] for r in retrieved]))
    return {
        "context_text": context_text,
        "sources": sources,
        "retrieved_chunks": retrieved
    }
