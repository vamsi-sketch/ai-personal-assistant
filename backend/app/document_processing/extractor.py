"""
Document Text Extraction Service
Supports:
- PDF (via PyMuPDF / fitz)
- DOCX (via python-docx)
- PPT / PPTX (via python-pptx)
- Plain Text (TXT / Markdown)
"""

import os
from typing import Dict, Any

class DocumentExtractor:
    @staticmethod
    def extract_text(file_path: str, filename: str) -> Dict[str, Any]:
        ext = os.path.splitext(filename)[1].lower()
        text = ""
        page_count = 1
        
        try:
            if ext == ".pdf":
                try:
                    import fitz  # PyMuPDF
                    doc = fitz.open(file_path)
                    page_count = len(doc)
                    pages_text = [page.get_text() for page in doc]
                    text = "\n\n".join(pages_text)
                    doc.close()
                except ImportError:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
                        
            elif ext in [".docx", ".doc"]:
                try:
                    import docx
                    doc = docx.Document(file_path)
                    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                    text = "\n".join(paragraphs)
                    page_count = max(1, len(paragraphs) // 5)
                except ImportError:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
                        
            elif ext in [".pptx", ".ppt"]:
                try:
                    from pptx import Presentation
                    prs = Presentation(file_path)
                    slides_text = []
                    for slide in prs.slides:
                        slide_words = []
                        for shape in slide.shapes:
                            if hasattr(shape, "text") and shape.text.strip():
                                slide_words.append(shape.text.strip())
                        if slide_words:
                            slides_text.append("\n".join(slide_words))
                    text = "\n\n--- Slide Break ---\n\n".join(slides_text)
                    page_count = len(prs.slides)
                except ImportError:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        text = f.read()
                        
            else:  # .txt, .md, code, etc.
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
                    page_count = max(1, len(text) // 1500)
                    
            return {
                "success": True,
                "text": text.strip(),
                "char_count": len(text),
                "word_count": len(text.split()),
                "page_count": page_count,
                "file_type": ext
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "text": "",
                "char_count": 0,
                "word_count": 0,
                "page_count": 0,
                "file_type": ext
            }
