import {
  ComponentType,
  LazyExoticComponent,
  ReactNode,
  lazy,
  useEffect,
  useState,
} from "react";

type LoadComponent = () => Promise<any>;

function loadComponent(scope: string, module: string): LoadComponent {
  return async () => {
    // @ts-ignore
    await __webpack_init_sharing__("default");
    // @ts-ignore
    const container = window[scope];
    if (!container) {
      throw new Error(`Container "${scope}" not found.`);
    }
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore
    const factory = await window[scope].get(module);
    if (typeof factory !== "function") {
      throw new Error(`Module "${module}" not found in Container "${scope}".`);
    }
    const Module = factory();
    return Module;
  };
}

const urlCache = new Set<string>();

type DynamicScriptResult = {
  ready: boolean;
  error: boolean;
  loading: boolean;
};

function useDynamicScript(url: string): DynamicScriptResult {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setError(false);
      setLoading(false);
      return;
    }

    setReady(false);
    setError(false);
    setLoading(true);

    const element = document.createElement("script");

    element.src = url;
    element.type = "text/javascript";
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
      setLoading(false);
    };

    element.onerror = () => {
      setReady(false);
      setError(true);
      setLoading(false);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    error,
    loading,
  };
}

// TODO: Check is component is already loaded
const componentCache = new Map<string, LazyExoticComponent<any>>();

export type FederatedComponentProps = {
  remoteUrl: string;
  scope: string;
  module: string;
};

export type FederatedComponentResult<T> = {
  isLoading: boolean;
  error: boolean;
  Component: ComponentType<T> | null;
};

export function useFederatedComponent<T>({
  remoteUrl,
  scope,
  module,
}: FederatedComponentProps): FederatedComponentResult<T> {
  const key = `${remoteUrl}-${scope}-${module}`;

  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ready, error, loading } = useDynamicScript(remoteUrl);

  useEffect(() => {
    setIsLoading(true);
    setComponent(null);
    // Only recalculate when key changes
  }, [key]);

  useEffect(() => {
    if (ready && !Component) {
      const loadComponentAndSet = async () => {
        try {
          const moduleFactory = await loadComponent(scope, module);
          const Comp = lazy(moduleFactory);
          componentCache.set(key, Comp);
          setComponent(Comp);
        } catch (error) {
          console.error(error);
          setComponent(null);
        } finally {
          setIsLoading(false);
        }
      };

      loadComponentAndSet();
    }
  }, [Component, ready, key]);

  return {
    isLoading: isLoading && loading,
    error,
    Component,
  };
}
