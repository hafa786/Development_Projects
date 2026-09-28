from app.ai_matcher import analyze_with_ai


def test_ai_falls_back_without_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    result = analyze_with_ai("Python Docker", "Python Docker Kubernetes")
    assert result["ai_enabled"] is False
    assert result["semantic_score"] is None
    assert result["keyword_score"] == result["overall_score"]
