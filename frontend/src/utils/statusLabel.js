

export function statusLabel(status) {
  switch (status) {
    case "pending":
      return "🕓 Ausstehend";
    case "accepted":
      return "✅ Akzeptiert";
    case "rejected":
      return "❌ Abgelehnt";
    default:
      return status || "—";
  }
}
