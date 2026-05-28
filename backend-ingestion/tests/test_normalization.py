from ingestion.normalization.pipeline import NormalizationPipeline


def test_normalization_dedupes_by_hash():
    pipeline = NormalizationPipeline()
    raw = [
        {"url": "https://a.com", "content_hash": "abc", "title": "A"},
        {"url": "https://a.com/dup", "content_hash": "abc", "title": "A dup"},
    ]
    pages, facts = pipeline.run("brand-1", raw)
    assert len(pages) == 1
    assert len(facts) == 1
