import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import {
  CollapsibleSection,
  FloatingInput,
  PageToolbar,
} from "../components/ui/WorkflowChrome";
import { WorkflowFooter } from "../components/ui/WorkflowFooter";
import type { Brand, NormalizedFact } from "../types/contracts";

export function BrandOverviewPage() {
  const { brandId = "" } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [facts, setFacts] = useState<NormalizedFact[]>([]);
  const [brandInfo, setBrandInfo] = useState("");

  useEffect(() => {
    Promise.all([api.getFacts(brandId), api.listBrands()]).then(([f, brands]) => {
      setFacts(f);
      const b = brands.find((x) => x.brand_id === brandId) ?? null;
      setBrand(b);
      setBrandInfo(
        b
          ? `${b.name} helps teams discover high-intent triggers from public web content and simulated user prompts.`
          : ""
      );
    });
  }, [brandId]);

  return (
    <div className="workflow-page">
      <PageToolbar />

      <CollapsibleSection title="Campaign identity">
        <FloatingInput label="Campaign Name" value={brand?.name ?? ""} />
      </CollapsibleSection>

      <CollapsibleSection title="Products">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((f) => (
                <tr key={f.normalized_fact_id}>
                  <td>
                    <strong>{f.title ?? f.page_type}</strong>{" "}
                    <span className="badge badge--utm">UTM</span>
                  </td>
                  <td className="data-table__desc">{f.summary ?? "—"}</td>
                  <td className="data-table__actions">
                    <a href={f.url} target="_blank" rel="noreferrer">
                      ↗
                    </a>
                    <button type="button">✎</button>
                    <button type="button" className="data-table__delete">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-meta">Showing 1–{facts.length} of {facts.length}</p>
        <div className="table-actions">
          <button type="button" className="btn btn--text">
            + Add product
          </button>
          <button type="button" className="btn btn--outline">
            ↑ Add catalog
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Company info *">
        <FloatingInput label="Brand Name" value={brand?.name ?? ""} />
        <FloatingInput
          label="Brand Information"
          value={brandInfo}
          onChange={setBrandInfo}
          multiline
        />
      </CollapsibleSection>

      <WorkflowFooter nextTo={`/brands/${brandId}/triggers`} />
    </div>
  );
}
