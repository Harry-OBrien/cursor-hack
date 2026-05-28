import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { brandId } = useParams();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Trigger Discovery</h2>
        <nav>
          <Link to="/">Projects</Link>
          <Link to="/brands/new">New brand</Link>
          {brandId && (
            <>
              <hr />
              <Link to={`/brands/${brandId}`}>Overview</Link>
              <Link to={`/brands/${brandId}/runs`}>Runs</Link>
              <Link to={`/brands/${brandId}/knowledge`}>Knowledge</Link>
              <Link to={`/brands/${brandId}/triggers`}>Triggers</Link>
              <Link to={`/brands/${brandId}/export`}>Export</Link>
            </>
          )}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
