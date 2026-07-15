import { Activity, FileText, MessageSquareText, Upload } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/ui/EmptyState";

const activityIcons = {
  upload: Upload,
  analysis: MessageSquareText,
};

function ActivityPage({ activities }) {
  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Activity</h2>
          <p>Review document indexing and grounded analysis actions from this session.</p>
        </div>
      </section>

      <section className="panel activity-panel">
        {activities.length > 0 ? (
          <div className="activity-list">
            {activities.map((item) => {
              const Icon = activityIcons[item.type] || FileText;
              return (
                <article key={item.id} className="activity-item">
                  <div className="activity-item__icon">
                    <Icon size={16} strokeWidth={1.7} />
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <time>{item.timeLabel}</time>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Activity}
            title="No workspace activity yet"
            description="Uploads and grounded analysis requests made in this frontend session will appear here."
          />
        )}
      </section>
    </PageContainer>
  );
}

export default ActivityPage;
