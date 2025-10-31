"use client";

import { useState } from "react";
import { Search, Copy, Check, Terminal, Code, Package, ChevronRight, Menu, X } from "lucide-react";
import { ComponentMap ,REGISTRY_DATA } from "./helper";

const getFirstComponent = (data:any) => {
    const firstCategory = Object.keys(data)[0];
    return data[firstCategory][0];
};

type ComponentName = keyof typeof ComponentMap;

interface SelectedComponent {
  name: ComponentName;
  title: string;
}

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState(getFirstComponent(REGISTRY_DATA));
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // however you set it
  const ComponentToRender = ComponentMap[selectedComponent.name as keyof typeof ComponentMap];

  const installCommand = `npx shadcn@latest add https://ocean-ui.com/registry/${selectedComponent.name}.json`;
  const codeExample = `import { ${selectedComponent.title.replace(/\s+/g, '')} } from "@/components/${selectedComponent.name}";\n\nexport default function Example() {\n  return (\n    <${selectedComponent.title.replace(/\s+/g, '')} />\n  );\n}`;

  const copyToClipboard = (text:any, setCopied:any) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  type ComponentData = {
    name: string;
    title: string;
    description: string;
  };

  const filteredRegistry = Object.entries(REGISTRY_DATA).reduce<Record<string, ComponentData[]>>(
    (acc, [category, components]) => {
      const filtered = components.filter(
        (comp) =>
          comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
  
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-40
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Ocean UI</h1>
                <p className="text-xs text-slate-400">Component Registry</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(filteredRegistry).map(([category, components]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {components.map((component) => (
                    <button
                      key={component.name}
                      onClick={() => {
                        setSelectedComponent(component);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group
                        ${selectedComponent.name === component.name
                          ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                          : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{component.title}</p>
                          {/*<p className="text-xs text-slate-500 truncate">{component.description}</p>*/}
                        </div>
                        <ChevronRight className={`
                          w-4 h-4 ml-2 transition-transform
                          ${selectedComponent.name === component.name ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}
                        `} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen p-6 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Components</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-blue-400">{selectedComponent.title}</span>
            </div>
            <h2 className="text-4xl font-bold text-white">{selectedComponent.title}</h2>
            <p className="text-lg text-slate-400">{selectedComponent.description}</p>
          </div>

          {/* Installation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Installation</h3>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-2 font-mono">Terminal</p>
                    <code className="text-sm text-slate-300 font-mono break-all">
                      {installCommand}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(installCommand, setCopiedInstall)}
                    className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    {copiedInstall ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Usage Example</h3>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-2 font-mono">example.tsx</p>
                    <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeExample, setCopiedCode)}
                    className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card (Now showing dynamic component or placeholder) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Preview</h3>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              {/* Preview container */}
              <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl p-8 min-h-[500px] flex items-center justify-center">
                {ComponentToRender ? (
                  // Render the actual component
                  <div className="w-full max-w-sm mx-auto h-full flex items-center justify-center py-8">
                    <ComponentToRender />
                  </div>
                ) : (
                  // Fallback placeholder
                  <div className="text-center space-y-4 py-8">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">{selectedComponent.title}</p>
                      <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Component preview will render here (No active preview component found for this item).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex items-center justify-center pt-8 pb-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <span>View Full Documentation</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}