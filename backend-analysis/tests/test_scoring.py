from analysis.scoring.service import TriggerScoringService


def test_scoring_orders_by_trigger_score():
    config = {
        "version": "1.0.0",
        "weights": {
            "frequency": 0.3,
            "intent": 0.25,
            "relevance": 0.25,
            "distinctiveness": 0.15,
            "ambiguity_penalty": 0.05,
        },
        "thresholds": {"prioritize": 0.75, "test": 0.55, "monitor": 0.35},
    }
    svc = TriggerScoringService(config)
    candidates = [
        {
            "phrase": "low",
            "phrase_type": "unigram",
            "appearance_count": 1,
            "appearance_rate": 0.1,
            "intent_bucket": "mixed",
            "source_page_ids": [],
        },
        {
            "phrase": "high intent phrase",
            "phrase_type": "bigram",
            "appearance_count": 10,
            "appearance_rate": 0.9,
            "intent_bucket": "transactional",
            "source_page_ids": ["a", "b"],
        },
    ]
    scored = svc.score(candidates)
    assert scored[0]["trigger_score"] >= scored[1]["trigger_score"]
