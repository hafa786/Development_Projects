from app.matcher import analyze, extract_skills

def test_extract_skills():
    assert "Spring Boot" in extract_skills("Java, Spring Boot, Docker")
    assert "Docker" in extract_skills("Java, Spring Boot, Docker")

def test_match_score():
    result = analyze("Java Spring Boot Docker", "Java Spring Boot Docker Kafka")
    assert result["match_score"] == 75
    assert result["missing_skills"] == ["Kafka"]
