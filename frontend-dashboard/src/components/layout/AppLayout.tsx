import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Brand } from "../../types/contracts";
import { HomeSidebar } from "./HomeSidebar";
import { PhoneMockPreview, PreviewPanel } from "../ui/PreviewPanel";
import { Logo, PROJECT_NAME } from "../ui/Logo";

const STEPS = [
  { path: "", label: "Campaign basics" },
  { path: "triggers", label: "Targeting" },
  { path: "knowledge", label: "Reference creatives" },
  { path: "export", label: "Budget" },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { brandId } = useParams();
  const location = useLocation();
  const isHome =
    location.pathname === "/app" || location.pathname === "/brands/new";
  const [brand, setBrand] = useState<Brand | null>(null);
  const [previewPhrase, setPreviewPhrase] = useState<string | undefined>();

  useEffect(() => {
    if (!brandId) {
      setBrand(null);
      return;
    }
    api
      .listBrands()
      .then((brands) => brands.find((b) => b.brand_id === brandId) ?? null)
      .then(setBrand)
      .catch(() => setBrand(null));
  }, [brandId]);

  useEffect(() => {
    const match = location.pathname.match(/\/triggers\/([^/]+)$/);
    if (match && brandId) {
      api.getTriggers(brandId).then((exp) => {
        const t = exp.triggers.find((x) => x.trigger_candidate_id === match[1]);
        setPreviewPhrase(t?.phrase);
      });
      return;
    }
    if (location.pathname.includes("/triggers") && brandId) {
      api.getTriggers(brandId).then((exp) => {
        setPreviewPhrase(exp.triggers[0]?.phrase);
      });
      return;
    }
    setPreviewPhrase(undefined);
  }, [location.pathname, brandId]);

  const showWorkflow = Boolean(brandId && !isHome);

  return (
    <div
      className={`app-shell${isHome ? " app-shell--home" : ""}${showWorkflow ? " app-shell--workflow" : ""}`}
    >
      {showWorkflow && (
        <aside className="icon-rail" aria-label="Quick navigation">
          <Link to="/" className="icon-rail__logo" title={PROJECT_NAME}>
            <Logo size={28} className="logo--rail" />
          </Link>
          <Link to="/app" className="icon-rail__btn" title="Dashboard">
            ⌕
          </Link>
          <Link to="/brands/new" className="icon-rail__btn" title="Add">
            +
          </Link>
          <Link
            to={`/brands/${brandId}`}
            className="icon-rail__btn"
            title="Dashboard"
          >
            ◉
          </Link>
          <Link
            to={`/brands/${brandId}/knowledge`}
            className="icon-rail__btn"
            title="Files"
          >
            ▤
          </Link>
          <span className="icon-rail__spacer" />
          <span className="icon-rail__btn">⚙</span>
          <span className="icon-rail__btn">↗</span>
        </aside>
      )}

      {isHome && <HomeSidebar />}

      {showWorkflow && (
        <nav className="step-nav" aria-label="Campaign steps">
          {STEPS.map((step) => {
            const to =
              step.path === ""
                ? `/brands/${brandId}`
                : `/brands/${brandId}/${step.path}`;
            return (
              <NavLink
                key={step.path || "overview"}
                to={to}
                end={step.path === ""}
                className={({ isActive }) =>
                  `step-nav__link${isActive ? " step-nav__link--active" : ""}`
                }
              >
                {step.label}
              </NavLink>
            );
          })}
          <div className="step-nav__footer">
            <Link to={`/brands/${brandId}/export`} className="step-nav__launch">
              Launch
            </Link>
            <p className="step-nav__hint">{brand?.name ?? "Project"}</p>
          </div>
        </nav>
      )}

      <main
        className={
          isHome
            ? location.pathname === "/brands/new"
              ? "main main--form"
              : "main main--hero"
            : "main main--workflow"
        }
      >
        {children}
      </main>

      {showWorkflow && (
        <PreviewPanel
          title="Campaign preview"
          adTitle={brand?.name}
          triggerPhrase={previewPhrase}
        >
          <PhoneMockPreview
            triggerPhrase={previewPhrase}
            adTitle={brand?.name ?? previewPhrase}
          />
        </PreviewPanel>
      )}
    </div>
  );
}
