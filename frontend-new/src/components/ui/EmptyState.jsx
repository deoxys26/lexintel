function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon ? (
        <div className="empty-state__icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.7} />
        </div>
      ) : null}
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
