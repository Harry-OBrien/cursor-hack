export interface TriggerFilterState {
  intent: string;
  minScore: number;
  phraseType: string;
}

export function TriggerFilters({
  value,
  onChange,
}: {
  value: TriggerFilterState;
  onChange: (v: TriggerFilterState) => void;
}) {
  return (
    <div className="filters">
      <label>
        Intent
        <select
          className="form-field__select"
          value={value.intent}
          onChange={(e) => onChange({ ...value, intent: e.target.value })}
        >
          <option value="">All</option>
          <option value="transactional">Transactional</option>
          <option value="comparison">Comparison</option>
          <option value="commercial_investigation">Commercial</option>
          <option value="informational">Informational</option>
          <option value="problem_solution">Problem / solution</option>
        </select>
      </label>
      <label>
        Min score
        <input
          className="form-field__input"
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={value.minScore}
          onChange={(e) =>
            onChange({ ...value, minScore: Number(e.target.value) })
          }
        />
      </label>
      <label>
        Phrase type
        <select
          className="form-field__select"
          value={value.phraseType}
          onChange={(e) => onChange({ ...value, phraseType: e.target.value })}
        >
          <option value="">All</option>
          <option value="unigram">Unigram</option>
          <option value="bigram">Bigram</option>
          <option value="keyphrase">Keyphrase</option>
          <option value="entity">Entity</option>
        </select>
      </label>
    </div>
  );
}
