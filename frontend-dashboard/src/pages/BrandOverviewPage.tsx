import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { CrawlSummaryCard } from "../components/ui/CrawlSummaryCard";

export function BrandOverviewPage() {
  const { brandId = "" } = useParams();
  const [pages, setPages] = useState(0);
  const [facts, setFacts] = useState(0);

  useEffect(() => {
    Promise.all([api.getSourcePages(brandId), api.getFacts(brandId)]).then(
      ([p, f]) => {
        setPages(p.length);
        setFacts(f.length);
      }
    );
  }, [brandId]);

  return (
    <div>
      <h1>Brand overview</h1>
      <CrawlSummaryCard pages={pages} facts={facts} />
    </div>
  );
}
