import { Suspense, useState } from "react";
import {
  FederatedComponentProps,
  useFederatedComponent,
} from "./useFederatedComponent";

function HeaderFederatedComponent() {
  const { isLoading, error, Component } = useFederatedComponent({
    remoteUrl: "http://localhost:3002/remoteEntry.js",
    scope: "layout",
    module: "./Header",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Error loading module "${module}"`}</div>;
  }

  if (Component) {
    return (
      <Suspense fallback={<div>Loading component...</div>}>
        <Component />
      </Suspense>
    );
  }

  return null;
}

export interface CardProps {
  title: string;
}

function CardFederatedComponent() {
  const { isLoading, error, Component } = useFederatedComponent<CardProps>({
    remoteUrl: "http://localhost:3003/remoteEntry.js",
    scope: "settings",
    module: "./Card",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{`Error loading module "${module}"`}</div>;
  }

  if (Component) {
    return (
      <Suspense fallback={<div>Loading component...</div>}>
        <Component title="CardFederatedComponent" />
      </Suspense>
    );
  }

  return null;
}
// TODO: Add ErrorBoundary
export function App() {
  const [system, setSystem] = useState<"layout" | "setting">();

  return (
    <div>
      <h1>Micro Frontend (Shopping)</h1>

      <h1>Dynamic System Host</h1>

      <p>
        The Dynamic System will take advantage Module Federation{" "}
        <strong>remotes</strong> and <strong>exposes</strong>. It will no load
        components that have been loaded already.
      </p>

      <button onClick={() => setSystem("layout")}>
        Load Header from Layout App
      </button>
      <button onClick={() => setSystem("setting")}>
        Load Card from Settings App
      </button>

      <div style={{ marginTop: "2em" }}>
        {system === "layout" && <HeaderFederatedComponent />}
        {system === "setting" && <CardFederatedComponent />}
      </div>
    </div>
  );
}
