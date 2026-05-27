function MessageBubble({ role, content }) {
  return (
    <div className={`message-row ${role === "user" ? "user-row" : "ai-row"}`}>
      <div className={`message-bubble ${role === "user" ? "user-bubble" : "ai-bubble"}`}>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default MessageBubble;