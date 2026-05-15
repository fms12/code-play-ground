import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  SandpackCodeEditor,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

// Lazy load preview (performance boost)
const SandpackPreview = lazy(() =>
  import("@codesandbox/sandpack-react").then((mod) => ({
    default: mod.SandpackPreview,
  })),
);

// ----------- Debounce Hook -----------
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ----------- Static Files -----------
const indexTsx = `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`;

const stylesCss = `
/* Tailwind via CDN */
`;

// ----------- Loader -----------
function Loader() {
  return (
    <div className="flex items-center justify-center h-full text-gray-400">
      Building preview...
    </div>
  );
}

// ----------- Main Component -----------
export function Result({ app }) {
  const [runPreview, setRunPreview] = useState(false);

  // Debounce code (avoid constant rebuilds)
  const debouncedCode = useDebounce(app.code, 500);

  // Reset preview when new code comes
  useEffect(() => {
    setRunPreview(false);
  }, [debouncedCode]);

  // Memoized files (prevents re-bundling)
  const files = useMemo(
    () => ({
      "/App.tsx":
        app.code ||
        `export default function App(){ return <div>Loading...</div> }`,
      "/index.tsx": { code: indexTsx, hidden: true },
      "/styles.css": { code: stylesCss, hidden: true },
    }),
    [debouncedCode],
  );

  return (
    <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <SandpackProvider
        files={files}
        template="react-ts"
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <Tabs.Root defaultValue="code">
          {/* Tabs Header */}
          <Tabs.List className="bg-gray-900/70 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
            <Tabs.Trigger
              value="preview"
              disabled={app.status !== "complete"}
              className="px-4 py-1 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50"
            >
              Preview
            </Tabs.Trigger>

            <Tabs.Trigger
              value="code"
              className="px-4 py-1 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-700/50"
            >
              Code
            </Tabs.Trigger>

            {/* Run Button */}
            <button
              onClick={() => setRunPreview(true)}
              className="ml-auto px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded-md text-white"
            >
              Run
            </button>
          </Tabs.List>

          {/* Preview */}
          <Tabs.Content value="preview" className="focus:outline-none">
            {runPreview ? (
              <Suspense fallback={<Loader />}>
                <SandpackPreview
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                  showRestartButton={false}
                  showOpenNewtab={false}
                  style={{ height: "500px" }}
                />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-gray-400">
                Click "Run" to load preview
              </div>
            )}
          </Tabs.Content>

          {/* Code */}
          <Tabs.Content value="code" className="focus:outline-none">
            <SandpackCodeEditor
              readOnly
              style={{ height: "500px" }}
              showLineNumbers
            />
          </Tabs.Content>
        </Tabs.Root>
      </SandpackProvider>
    </div>
  );
}
