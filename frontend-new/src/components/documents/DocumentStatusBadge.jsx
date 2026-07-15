import Badge from "../ui/Badge";

function DocumentStatusBadge({ status = "Ready" }) {
  const tone = status === "Indexed" || status === "Ready" ? "success" : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export default DocumentStatusBadge;
