from io import BytesIO
from pathlib import PurePath

from pypdf import PdfReader


def extract(filename: str, data: bytes) -> list[tuple[int | None, str]]:
    extension = PurePath(filename).suffix.lower()
    if extension in {".txt", ".md"}:
        return [(None, data.decode("utf-8-sig"))]
    if extension != ".pdf":
        raise ValueError("Use PDF, UTF-8 TXT or Markdown.")
    if not data.startswith(b"%PDF-"):
        raise ValueError("Invalid PDF header.")
    reader = PdfReader(BytesIO(data))
    if reader.is_encrypted or len(reader.pages) > 100:
        raise ValueError("PDF must be unencrypted and at most 100 pages.")
    pages = []
    total = 0
    for number, page in enumerate(reader.pages, 1):
        content = page.extract_text() or ""
        total += len(content)
        if total > 200_000:
            raise ValueError("Extracted text exceeds the document limit.")
        pages.append((number, content))
    return pages


def chunk_pages(pages: list[tuple[int | None, str]]) -> list[tuple[int | None, str]]:
    chunks = []
    for page, content in pages:
        content = " ".join(content.replace("\x00", " ").split())
        start = 0
        while start < len(content):
            end = min(start + 1200, len(content))
            if end < len(content):
                boundary = content.rfind(" ", start + 900, end)
                if boundary != -1:
                    end = boundary
            chunks.append((page, content[start:end].strip()))
            if end == len(content):
                break
            start = end - 150
    if not chunks:
        raise ValueError("No extractable text found.")
    if len(chunks) > 250:
        raise ValueError("Document exceeds the chunk limit.")
    return chunks
