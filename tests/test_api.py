"""
Integration tests for FastAPI endpoints
"""

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

class TestAPI(unittest.TestCase):
    def test_root_endpoint(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("dkt_engine", data)

    def test_documents_list(self):
        response = client.get("/api/documents")
        self.assertEqual(response.status_code, 200)
        docs = response.json()
        self.assertIsInstance(docs, list)
        self.assertGreaterEqual(len(docs), 1)

    def test_mastery_endpoint(self):
        response = client.get("/api/mastery")
        self.assertEqual(response.status_code, 200)
        mastery = response.json()
        self.assertIsInstance(mastery, list)
        self.assertTrue(any("dkt_mastery" in item for item in mastery))

    def test_recommendations_endpoint(self):
        response = client.get("/api/recommendations")
        self.assertEqual(response.status_code, 200)
        recs = response.json()
        self.assertIsInstance(recs, list)

if __name__ == "__main__":
    unittest.main()
