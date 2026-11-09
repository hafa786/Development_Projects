import unittest

from app.ingestion import chunk_pages, extract


class IngestionTest(unittest.TestCase):
    def test_preserves_pages_and_overlap(self):
        chunks = chunk_pages([(2, "a" * 1201), (3, "Page three")])
        self.assertEqual(chunks, [(2, "a" * 1200), (2, "a" * 151), (3, "Page three")])

    def test_reads_utf8_bom(self):
        self.assertEqual(extract("test.MD", "﻿Hyvää päivää".encode()), [(None, "Hyvää päivää")])

    def test_rejects_empty_and_invalid_files(self):
        with self.assertRaises(ValueError):
            chunk_pages([(None, " \x00 ")])
        with self.assertRaises(ValueError):
            extract("file.pdf", b"plain text")
        with self.assertRaises(ValueError):
            extract("file.exe", b"plain text")
