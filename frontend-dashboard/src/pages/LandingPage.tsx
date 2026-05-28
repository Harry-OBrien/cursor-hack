import { Link } from "react-router-dom";
import { Logo, PROJECT_NAME } from "../components/ui/Logo";
import { PhoneMockPreview } from "../components/ui/PreviewPanel";

const FEATURES = [
  {
    title: "Crawl & structure",
    body: "Pull brand pages via Tavily — homepage, pricing, product, and docs — into a clean knowledge base.",
  },
  {
    title: "Simulate intent",
    body: "Run synthetic prompts across intent buckets and surface recurring phrases in responses.",
  },
  {
    title: "Review & export",
    body: "Rank triggers with evidence, approve or reject in the dashboard, and export a shortlist for ads.",
  },
];

const STEPS = [
  { num: "01", title: "Ingest", desc: "Add a brand domain. We crawl and normalize facts automatically." },
  { num: "02", title: "Analyze", desc: "Prompt runs extract high-intent keywords and score each trigger." },
  { num: "03", title: "Launch", desc: "Review ranked triggers with source evidence before campaign testing." },
];

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          <span className="landing-nav__logo-wrap">
            <Logo size={28} className="logo--landing" />
          </span>
          <span className="landing-nav__name">{PROJECT_NAME}</span>
        </Link>
        <nav className="landing-nav__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/app" className="landing-nav__signin">
            Sign in
          </Link>
          <Link to="/app" className="btn btn--primary landing-nav__cta">
            Get started
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="landing-hero__eyebrow">Trigger discovery for modern brands</p>
          <h1 className="landing-hero__title">
            Find high-intent triggers
            <br />
            before you spend on ads.
          </h1>
          <p className="landing-hero__sub">
            {PROJECT_NAME} crawls your brand site, simulates real user prompts, and ranks the
            keywords and phrases worth testing — with full source evidence.
          </p>
          <div className="landing-hero__actions">
            <Link to="/app" className="btn btn--primary btn--lg">
              Start free →
            </Link>
            <Link to="/brands/new" className="btn btn--outline btn--lg">
              Create a project
            </Link>
          </div>
          <p className="landing-hero__note">No credit card · Human-in-the-loop review · Tavily-powered</p>
        </div>
        <div className="landing-hero__visual">
          <div className="landing-hero__logo-card">
            <Logo size={72} className="logo--hero" />
          </div>
          <div className="landing-hero__preview">
            <PhoneMockPreview
              triggerPhrase="product analytics"
              adTitle="Acme Analytics"
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-steps">
        <p className="landing-section__eyebrow">How it works</p>
        <h2 className="landing-section__title">From domain to ranked triggers in three steps</h2>
        <div className="landing-steps__grid">
          {STEPS.map((s) => (
            <article key={s.num} className="landing-step">
              <span className="landing-step__num">{s.num}</span>
              <h3 className="landing-step__title">{s.title}</h3>
              <p className="landing-step__desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="landing-section landing-features">
        <p className="landing-section__eyebrow">Features</p>
        <h2 className="landing-section__title">Everything you need to review with confidence</h2>
        <div className="landing-features__grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="landing-feature">
              <h3 className="landing-feature__title">{f.title}</h3>
              <p className="landing-feature__body">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta__inner">
          <h2 className="landing-cta__title">Ready to discover your triggers?</h2>
          <p className="landing-cta__sub">
            Open the dashboard, add a brand, and review ranked opportunities in minutes.
          </p>
          <Link to="/app" className="btn btn--primary btn--lg">
            Open dashboard →
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-footer__brand">
          <span className="landing-nav__logo-wrap landing-nav__logo-wrap--sm">
            <Logo size={22} className="logo--landing" />
          </span>
          {PROJECT_NAME}
        </Link>
        <p className="landing-footer__copy">© 2026 {PROJECT_NAME}. Built for the Cursor hackathon.</p>
      </footer>
    </div>
  );
}
