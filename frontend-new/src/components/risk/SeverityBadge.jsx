import Badge from "../ui/Badge";

function SeverityBadge({ severity = "Medium" }) {
  const tone = severity.toLowerCase();
  return <Badge tone={tone}>{severity}</Badge>;
}

export default SeverityBadge;
