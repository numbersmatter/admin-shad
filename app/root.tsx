import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { Theme, ThemeProvider, useTheme } from "./lib/theme-provider";
import clsx from "clsx";
import { Toaster } from "./components/ui/toaster";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

function App() {
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme, "h-full")}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
