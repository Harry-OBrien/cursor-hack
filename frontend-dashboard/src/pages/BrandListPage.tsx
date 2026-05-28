import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Brand } from "../types/contracts";

export function BrandListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState("acme-analytics.example");
  const [goal, setGoal] = useState("discover high-intent search triggers");

  useEffect(() => {
    api.listBrands().then(setBrands).catch((e) => setError(String(e)));
  }, []);

  const featured = brands[0];

  useEffect(() => {
    if (featured?.primary_domain) setDomain(featured.primary_domain);
  }, [featured?.primary_domain]);

  return (
    <div className="hero">
      <p className="hero__eyebrow">Launch your campaign with a prompt for:</p>
      <div className="hero__brand">
        <span className="hero__folder" aria-hidden>
          📁
        </span>
        <h1 className="hero__title">{featured?.name ?? "Your brand"}</h1>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="hero-card">
        <p className="hero-card__line">
          <span className="hero-card__lead">Launch a campaign for</span>
          <label className="float-field float-field--inline">
            <span className="float-field__label">Brand URL</span>
            <input
              className="float-field__input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="acme.com"
            />
          </label>
          <span className="hero-card__lead">to</span>
        </p>
        <textarea
          className="hero-card__goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={2}
          placeholder="describe your campaign goal…"
        />
        <div className="hero-card__actions">
          <Link to="/brands/new" className="btn btn--brief">
            📎 Brief
          </Link>
          <Link
            to={featured ? `/brands/${featured.brand_id}` : "/brands/new"}
            className="btn btn--create"
            aria-label="Create campaign"
          >
            ↗
          </Link>
        </div>
      </div>

      <div className="hero-divider">or create campaign manually</div>
    </div>
  );
}
