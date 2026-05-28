import { Link } from "react-router-dom";

export function WorkflowFooter({
  backTo,
  nextTo,
  showSkip = true,
}: {
  backTo?: string;
  nextTo?: string;
  showSkip?: boolean;
}) {
  return (
    <div className="workflow-footer">
      <div className="workflow-footer__left">
        {showSkip && (
          <button type="button" className="workflow-footer__text">
            SKIP
          </button>
        )}
        {backTo && (
          <Link to={backTo} className="workflow-footer__text">
            BACK
          </Link>
        )}
      </div>
      <div className="workflow-footer__right">
        <button type="button" className="btn btn--outline">
          Save as Draft
        </button>
        {nextTo ? (
          <Link to={nextTo} className="btn btn--next">
            NEXT
          </Link>
        ) : (
          <button type="button" className="btn btn--next">
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}
