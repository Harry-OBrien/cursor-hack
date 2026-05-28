import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Brand } from "../../types/contracts";
import { Logo, PROJECT_NAME } from "../ui/Logo";

export function HomeSidebar() {
  const location = useLocation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [accountsOpen, setAccountsOpen] = useState(true);

  useEffect(() => {
    api.listBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const featured = brands[0];

  return (
    <aside className="home-sidebar">
      <Link to="/" className="home-sidebar__account">
        <span className="home-sidebar__logo">
          <Logo size={32} className="logo--sidebar" />
        </span>
        <div className="home-sidebar__account-text">
          <p className="home-sidebar__name">{PROJECT_NAME}</p>
          <p className="home-sidebar__role">Owner</p>
        </div>
        <span className="home-sidebar__collapse" aria-hidden>
          ‹
        </span>
      </Link>

      <div className="home-sidebar__search">
        <span className="home-sidebar__search-icon" aria-hidden>
          ⌕
        </span>
        <input type="search" placeholder="Search" aria-label="Search" />
        <kbd>⌘ K</kbd>
      </div>

      <p className="home-sidebar__section">Quick actions</p>
      <Link
        to="/brands/new"
        className={`home-sidebar__action${location.pathname === "/brands/new" ? " home-sidebar__action--active" : ""}`}
      >
        <span className="home-sidebar__action-icon">⊕</span>
        Create project
      </Link>

      <p className="home-sidebar__section">Dashboard</p>
      <button
        type="button"
        className="home-sidebar__expand"
        onClick={() => setAccountsOpen((o) => !o)}
      >
        All brand projects
        <span aria-hidden>{accountsOpen ? "▾" : "▸"}</span>
      </button>
      {accountsOpen && (
        <nav className="home-sidebar__tree">
          {brands.map((b) => (
            <Link
              key={b.brand_id}
              to={`/brands/${b.brand_id}`}
              className={`home-sidebar__tree-item${
                location.pathname.startsWith(`/brands/${b.brand_id}`)
                  ? " home-sidebar__tree-item--active"
                  : ""
              }`}
            >
              <span className="home-sidebar__folder" aria-hidden>
                📁
              </span>
              {b.name}
            </Link>
          ))}
          <Link to="/brands/new" className="home-sidebar__tree-item home-sidebar__tree-item--add">
            <span aria-hidden>+</span> New project
          </Link>
        </nav>
      )}

      <p className="home-sidebar__section">
        {PROJECT_NAME} ads <span className="badge badge--beta">Beta</span>
      </p>
      <Link
        to={featured ? `/brands/${featured.brand_id}/triggers` : "/app"}
        className="home-sidebar__link"
      >
        Campaigns
      </Link>

      <p className="home-sidebar__section">Account</p>
      <button type="button" className="home-sidebar__link home-sidebar__link--chevron">
        Account manager <span>›</span>
      </button>
      <button type="button" className="home-sidebar__link home-sidebar__link--chevron">
        Onboarding <span>›</span>
      </button>
      <button type="button" className="home-sidebar__link home-sidebar__link--chevron">
        Integrations <span>›</span>
      </button>

      <div className="home-sidebar__invite">
        <span className="home-sidebar__invite-icon">👤+</span>
        <div>
          <p className="home-sidebar__invite-title">Invite a teammate</p>
          <p className="home-sidebar__invite-sub">Collaborate on triggers</p>
        </div>
      </div>

      <div className="home-sidebar__footer">
        <button type="button" className="home-sidebar__icon-btn" title="Settings">
          ⚙
        </button>
        <button type="button" className="home-sidebar__icon-btn" title="Help">
          ?
        </button>
        <button type="button" className="home-sidebar__icon-btn" title="Profile">
          ○
        </button>
        <button type="button" className="home-sidebar__icon-btn" title="Logout">
          ↗
        </button>
      </div>
    </aside>
  );
}
