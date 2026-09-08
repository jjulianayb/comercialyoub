import { createFileRoute } from "@tanstack/react-router";
import { Gate } from "../index";

export const Route = createFileRoute("/p/$token")({
  component: ProposalTokenRoute,
});

function ProposalTokenRoute() {
  const { token } = Route.useParams();
  return <Gate initialToken={token} />;
}
