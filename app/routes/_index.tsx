import { MetaFunction } from "@remix-run/react";
import { Dashboard } from "~/components/dashboard/dashboard";
import { StandardShell } from "~/components/shell/shell";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <StandardShell>
      <Dashboard />
    </StandardShell>
  );
}
