from io import BytesIO
from pypdf import PdfReader
from docx import Document


def extract_text(filename: str, content: bytes) -> str:
    name = filename.lower()
    if name.endswith(".pdf"):
        reader = PdfReader(BytesIO(content))
        return "\n".join((p.extract_text() or "") for p in reader.pages)
    if name.endswith(".docx"):
        doc = Document(BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    raise ValueError("Only PDF and DOCX resumes are supported.")
