import { MetaFunction } from "@remix-run/react";
import { Dashboard } from "~/components/dashboard/dashboard";
import { StandardShell } from "~/components/shell/shell";

export const meta: MetaFunction = () => {
  return [
    { title: "Furbrush" },
    {
      property: "og:title",
      content: "Furbrush",
    },
    {
      name: "description",
      content: "This app is made by artist for artists.",
    },
  ];
};

export default function Index() {
  return (
    <StandardShell>
      <Dashboard />
    </StandardShell>
  );
}
