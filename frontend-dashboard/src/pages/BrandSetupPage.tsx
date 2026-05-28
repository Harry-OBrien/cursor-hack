import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageToolbar } from "../components/ui/WorkflowChrome";
import { FloatingInput } from "../components/ui/WorkflowChrome";
import { TagPill } from "../components/ui/TagPill";

export function BrandSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [competitorInput, setCompetitorInput] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const addCompetitor = () => {
    const v = competitorInput.trim();
    if (v && !competitors.includes(v)) {
      setCompetitors([...competitors, v]);
      setCompetitorInput("");
    }
  };

  const addTopic = () => {
    const v = topicInput.trim();
    if (v && !topics.includes(v)) {
      setTopics([...topics, v]);
      setTopicInput("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="setup-page">
      <PageToolbar />

      <form onSubmit={handleSubmit}>
        <div className="section-card section-card--static">
          <h2 className="section-card__title">Brand identity</h2>
          <div className="section-card__body">
            <FloatingInput
              label="Brand name"
              value={name}
              onChange={setName}
              placeholder="Lily's Kitchen"
            />
            <FloatingInput
              label="Primary domain"
              value={domain}
              onChange={setDomain}
              placeholder="lilyskitchen.com"
            />
          </div>
        </div>

        <div className="section-card section-card--static">
          <h2 className="section-card__title">Competitors</h2>
          <div className="section-card__body">
            <div className="inline-add">
              <input
                className="float-field__input"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                placeholder="competitor.com"
              />
              <button type="button" className="btn btn--icon" onClick={addCompetitor}>
                +
              </button>
            </div>
            <div className="tag-cloud">
              {competitors.map((c) => (
                <TagPill
                  key={c}
                  label={c}
                  onRemove={() => setCompetitors(competitors.filter((x) => x !== c))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="section-card section-card--static">
          <h2 className="section-card__title">Seed topics</h2>
          <div className="section-card__body">
            <div className="inline-add">
              <input
                className="float-field__input"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="grain free dog food"
              />
              <button type="button" className="btn btn--icon" onClick={addTopic}>
                +
              </button>
            </div>
            <div className="tag-cloud">
              {topics.map((t) => (
                <TagPill
                  key={t}
                  label={t}
                  onRemove={() => setTopics(topics.filter((x) => x !== t))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="workflow-footer">
          <div className="workflow-footer__left">
            <button type="button" className="workflow-footer__text" onClick={() => navigate("/")}>
              BACK
            </button>
          </div>
          <div className="workflow-footer__right">
            <button type="button" className="btn btn--outline">
              Save as Draft
            </button>
            <button type="submit" className="btn btn--next">
              CREATE PROJECT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
