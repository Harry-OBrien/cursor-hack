import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { TriggerTable } from "../components/ui/TriggerTable";
import { TagPill } from "../components/ui/TagPill";
import {
  CollapsibleSection,
  PageToolbar,
} from "../components/ui/WorkflowChrome";
import { WorkflowFooter } from "../components/ui/WorkflowFooter";
import type { TriggerCandidate } from "../types/contracts";

const MOCK_PROMPTS = [
  "My team needs better funnel analytics — what's the best tool for a Series A startup?",
  "I'm comparing Mixpanel alternatives with transparent pricing — any recommendations?",
  "How do I track cohort retention across mobile and web without a data engineer?",
];

const MOCK_NEG_PROMPTS = [
  "Free analytics forever with no limits",
];

const MOCK_PERSONAS = [
  "Growth PMs at B2B SaaS startups who need self-serve product analytics without a data team.",
  "Marketing ops leads comparing attribution tools before Q3 budget planning.",
  "Founders evaluating analytics stacks during seed-to-Series-A transition.",
];

const MOCK_NEG_KEYWORDS = ["free forever", "crack", "pirated"];

export function TriggerRankingPage() {
  const { brandId = "" } = useParams();
  const [triggers, setTriggers] = useState<TriggerCandidate[]>([]);
  const [promptInput, setPromptInput] = useState("");
  const [prompts, setPrompts] = useState(MOCK_PROMPTS);
  const [personaInput, setPersonaInput] = useState("");
  const [personas, setPersonas] = useState(MOCK_PERSONAS);

  useEffect(() => {
    api.getTriggers(brandId).then((exp) => setTriggers(exp.triggers));
  }, [brandId]);

  const positive = useMemo(
    () => triggers.filter((t) => t.trigger_score >= 0.5),
    [triggers]
  );
  const negative = useMemo(
    () => triggers.filter((t) => t.trigger_score < 0.5),
    [triggers]
  );

  const addPrompt = () => {
    const v = promptInput.trim();
    if (v) {
      setPrompts([...prompts, v]);
      setPromptInput("");
    }
  };

  const addPersona = () => {
    const v = personaInput.trim();
    if (v) {
      setPersonas([...personas, v]);
      setPersonaInput("");
    }
  };

  return (
    <div className="workflow-page">
      <PageToolbar />

      <div className="tag-row">
        {triggers.slice(0, 10).map((t) => (
          <TagPill key={t.trigger_candidate_id} label={t.phrase} />
        ))}
      </div>

      <CollapsibleSection title="Geographic targeting">
        <button type="button" className="btn btn--outline btn--block">
          + Add country
        </button>
      </CollapsibleSection>

      <CollapsibleSection
        title="Keyword targeting"
        action={
          <button type="button" className="section-card__regen">
            Regenerate
          </button>
        }
      >
        <div className="keyword-columns">
          <div className="keyword-columns__col">
            <label className="float-field">
              <span className="float-field__label">Positive keywords</span>
              <div className="inline-add">
                <input className="float-field__input" placeholder="Type or paste keywords…" />
                <button type="button" className="btn btn--icon">
                  +
                </button>
              </div>
            </label>
            <div className="tag-cloud">
              {positive.map((t) => (
                <TagPill key={t.trigger_candidate_id} label={t.phrase} />
              ))}
            </div>
          </div>
          <div className="keyword-columns__col">
            <label className="float-field">
              <span className="float-field__label">Negative keywords</span>
              <div className="inline-add">
                <input className="float-field__input" placeholder="Type or paste keywords…" />
                <button type="button" className="btn btn--icon">
                  +
                </button>
              </div>
            </label>
            <div className="tag-cloud">
              {MOCK_NEG_KEYWORDS.map((k) => (
                <TagPill key={k} label={k} />
              ))}
              {negative.map((t) => (
                <TagPill key={t.trigger_candidate_id} label={t.phrase} />
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Prompt-bidding"
        action={
          <button type="button" className="section-card__regen">
            Regenerate
          </button>
        }
      >
        <label className="float-field">
          <span className="float-field__label">Positive prompts</span>
          <div className="inline-add">
            <input
              className="float-field__input"
              placeholder="Type or paste prompts (one per line)"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPrompt())}
            />
            <button type="button" className="btn btn--icon" onClick={addPrompt}>
              +
            </button>
          </div>
        </label>
        <ul className="prompt-list">
          {prompts.map((p, i) => (
            <li key={i}>
              <span>{p}</span>
              <button
                type="button"
                onClick={() => setPrompts(prompts.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <label className="float-field" style={{ marginTop: "1rem" }}>
          <span className="float-field__label">Negative prompts</span>
          <div className="inline-add">
            <input
              className="float-field__input"
              placeholder="Type or paste prompts to exclude…"
            />
            <button type="button" className="btn btn--icon">
              +
            </button>
          </div>
        </label>
        <ul className="prompt-list">
          {MOCK_NEG_PROMPTS.map((p, i) => (
            <li key={i}>
              <span>{p}</span>
              <button type="button">×</button>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="Personas">
        <label className="float-field">
          <span className="float-field__label">Personas</span>
          <div className="inline-add">
            <input
              className="float-field__input"
              placeholder="e.g. Tech-savvy growth PMs"
              value={personaInput}
              onChange={(e) => setPersonaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPersona())}
            />
            <button type="button" className="btn btn--icon" onClick={addPersona}>
              +
            </button>
          </div>
        </label>
        <ul className="persona-list">
          {personas.map((p, i) => (
            <li key={i}>
              <span>{p}</span>
              <button
                type="button"
                onClick={() => setPersonas(personas.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <TriggerTable brandId={brandId} triggers={triggers} />

      <WorkflowFooter
        backTo={`/brands/${brandId}`}
        nextTo={`/brands/${brandId}/knowledge`}
      />
    </div>
  );
}
