/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  RotateCcw,
  Plus,
  Compass,
  FileText,
  Settings,
  Cpu,
  Database,
  Globe,
  ArrowLeftRight,
  Code,
  CheckCircle,
  AlertTriangle,
  X,
  HelpCircle,
  Layout,
  Layers,
} from "lucide-react";

import {
  InputNode,
  OutputNode,
  LLMNode,
  TextNode,
  DatabaseNode,
  HTTPNode,
  TranslatorNode,
  CodeNode,
  RouterNode,
} from "./components/CustomNodes";

// Register custom node types
const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  llmNode: LLMNode,
  textNode: TextNode,
  databaseNode: DatabaseNode,
  httpNode: HTTPNode,
  translatorNode: TranslatorNode,
  codeNode: CodeNode,
  routerNode: RouterNode,
};

// Initial nodes template
const initialNodes = [
  {
    id: "input-1",
    type: "inputNode",
    position: { x: 80, y: 150 },
    data: { label: "Input Query", inputName: "user_query", inputType: "Text" },
  },
  {
    id: "text-1",
    type: "textNode",
    position: { x: 380, y: 150 },
    data: {
      label: "Formatter",
      text: "You are translating: {{user_query}} to Spanish.",
      variables: ["user_query"],
    },
  },
  {
    id: "llm-1",
    type: "llmNode",
    position: { x: 740, y: 120 },
    data: {
      label: "Gemini Model",
      model: "gemini-2.5-flash",
      systemPrompt: "Keep translation short and standard.",
      prompt: "Structure: Translate the text: {{user_query}}",
      temperature: 0.7,
    },
  },
  {
    id: "output-1",
    type: "outputNode",
    position: { x: 1100, y: 180 },
    data: { label: "Final Translation Output", outputName: "translated_text", outputType: "Text" },
  },
];

// Initial edges template
const initialEdges = [
  { id: "e-input-text", source: "input-1", sourceHandle: "value", target: "text-1", targetHandle: "user_query" },
  { id: "e-text-llm", source: "text-1", sourceHandle: "output", target: "llm-1", targetHandle: "prompt" },
  { id: "e-llm-output", source: "llm-1", sourceHandle: "response", target: "output-1", targetHandle: "value" },
];

function BuilderWorkspace() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);
  const { screenToFlowPosition, setViewport } = useReactFlow();

  // Dynamic state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalResult, setModalResult] = useState<{
    show: boolean;
    nodesCount: number;
    edgesCount: number;
    isDag: boolean;
  } | null>(null);

  const [activeTemplate, setActiveTemplate] = useState<string>("translator");
  const [dragType, setDragType] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  // Connection handling
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Toolbox item configurations
  const nodeDefinitions = [
    {
      type: "inputNode",
      title: "Input Node",
      category: "Intake",
      description: "Declare inbound inputs & format parameters",
      icon: <FileText size={16} />,
      color: "border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
      initialData: { label: "Input Node", inputName: "user_input", inputType: "Text" },
    },
    {
      type: "outputNode",
      title: "Output Node",
      category: "Delivery",
      description: "Produce outgoing API payloads or files",
      icon: <Settings size={16} />,
      color: "border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
      initialData: { label: "Output Node", outputName: "server_response", outputType: "Text" },
    },
    {
      type: "llmNode",
      title: "LLM Inference",
      category: "Cognition",
      description: "Route text streams through Gemini AI models",
      icon: <Cpu size={16} />,
      color: "border-violet-500 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20",
      initialData: {
        label: "AI Model",
        systemPrompt: "You are a direct, concise helper.",
        prompt: "Analyze: {{input_text}}",
        temperature: 0.7,
        model: "gemini-2.5-flash",
      },
    },
    {
      type: "textNode",
      title: "Text / Variable Node",
      category: "Formatting",
      description: "Create standard texts or dynamic variable blocks",
      icon: <FileText size={16} />,
      color: "border-teal-500 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20",
      initialData: { label: "Text Formatter", text: "Welcome {{user_name}}!", variables: ["user_name"] },
    },
    {
      type: "databaseNode",
      title: "SQL Query DB",
      category: "Storage",
      description: "Execute SELECT/INSERT SQL queries",
      icon: <Database size={16} />,
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      initialData: { label: "SQL Query", table: "users", operation: "SELECT", query: "SELECT * FROM users;" },
    },
    {
      type: "httpNode",
      title: "HTTP Endpoint",
      category: "Web Integration",
      description: "Interact with outer REST API microservices",
      icon: <Globe size={16} />,
      color: "border-sky-500 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20",
      initialData: { label: "REST Endpoint", url: "https://api.external.com/v1", method: "POST", headers: "" },
    },
    {
      type: "translatorNode",
      title: "Translator API",
      category: "Utilities",
      description: "Translate content streams instantly",
      icon: <ArrowLeftRight size={16} />,
      color: "border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
      initialData: { label: "Translator", sourceLanguage: "Auto", targetLanguage: "Spanish" },
    },
    {
      type: "codeNode",
      title: "Script Sandbox",
      category: "Automation",
      description: "Execute sandboxed JS, Python, or Bash",
      icon: <Code size={16} />,
      color: "border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
      initialData: {
        label: "Function Sandbox",
        language: "javascript",
        code: "function main(input) {\n  return input.toUpperCase();\n}",
      },
    },
    {
      type: "routerNode",
      title: "Logic Router",
      category: "Conditional",
      description: "Route decisions in branches",
      icon: <Compass size={16} />,
      color: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20",
      initialData: { label: "Condition Router", condition: "equals", ruleValue: "" },
    },
  ];

  // Instantly Spawn a Node on Canvas
  const spawnNode = useCallback(
    (type: string, initialData: any) => {
      const id = `${type.replace("Node", "")}-${Date.now()}`;
      // Spawn slightly offset from the top left viewport area
      const newNode = {
        id,
        type,
        position: { x: 250 + Math.random() * 80, y: 150 + Math.random() * 80 },
        data: { ...initialData },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Drag and drop mechanics
  const handleDragStart = (e: React.DragEvent, type: string) => {
    setDragType(type);
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!dragType) return;

      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const matchedDef = nodeDefinitions.find((n) => n.type === type);
      const initialData = matchedDef ? matchedDef.initialData : { label: "Node" };

      const id = `${type.replace("Node", "")}-${Date.now()}`;
      const newNode = {
        id,
        type,
        position,
        data: { ...initialData },
      };

      setNodes((nds) => nds.concat(newNode));
      setDragType(null);
    },
    [dragType, screenToFlowPosition, setNodes]
  );

  // Clears active layout state
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  // Submit Pipeline data to backend Express API
  const submitPipeline = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error("Pipeline parse endpoint failed.");
      }

      const result = await response.json();
      setModalResult({
        show: true,
        nodesCount: result.num_nodes,
        edgesCount: result.num_edges,
        isDag: result.is_dag,
      });
    } catch (error) {
      console.error(error);
      alert("Error sending pipeline telemetry data. Verify Express backend is online.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Switch pipeline templates to let users experience different configurations
  const loadTemplate = (templateName: string) => {
    setActiveTemplate(templateName);
    if (templateName === "translator") {
      setNodes(initialNodes as any);
      setEdges(initialEdges as any);
      setViewport({ x: 50, y: 50, zoom: 0.95 });
    } else if (templateName === "apipipeline") {
      const dbNodes = [
        {
          id: "db-1",
          type: "databaseNode",
          position: { x: 80, y: 150 },
          data: { label: "Prod DB Data", table: "orders", operation: "SELECT", query: "SELECT * FROM orders WHERE status = {{params}}" },
        },
        {
          id: "code-1",
          type: "codeNode",
          position: { x: 420, y: 120 },
          data: {
            label: "Processor",
            language: "javascript",
            code: "function main(input) {\n  return JSON.stringify(input.filter(x => x.price > 100));\n}",
          },
        },
        {
          id: "http-1",
          type: "httpNode",
          position: { x: 780, y: 140 },
          data: { label: "Stripe Sync", url: "https://api.stripe.com/v1/refunds", method: "POST", headers: "{}" },
        },
        {
          id: "output-db",
          type: "outputNode",
          position: { x: 1140, y: 200 },
          data: { label: "Client Receipt", outputName: "receipt_url", outputType: "JSON" },
        },
      ];
      const dbEdges = [
        { id: "e-db-code", source: "db-1", sourceHandle: "rows", target: "code-1", targetHandle: "inputData" },
        { id: "e-code-http", source: "code-1", sourceHandle: "result", target: "http-1", targetHandle: "payload" },
        { id: "e-http-out", source: "http-1", sourceHandle: "response", target: "output-db", targetHandle: "value" },
      ];
      setNodes(dbNodes as any);
      setEdges(dbEdges as any);
      setViewport({ x: 50, y: 50, zoom: 0.9 });
    } else if (templateName === "cyclic") {
      // Create a cyclic loop to show off DAG checker
      const cyclicNodes = [
        {
          id: "input-cyc",
          type: "inputNode",
          position: { x: 100, y: 150 },
          data: { label: "Inbound Stream", inputName: "event_record", inputType: "Text" },
        },
        {
          id: "router-cyc",
          type: "routerNode",
          position: { x: 400, y: 140 },
          data: { label: "Loop Evaluator", condition: "lt", ruleValue: "100" },
        },
        {
          id: "code-cyc",
          type: "codeNode",
          position: { x: 740, y: 240 },
          data: {
            label: "Counter +1",
            language: "javascript",
            code: "function main(n) { return n + 1; }",
          },
        },
        {
          id: "output-cyc",
          type: "outputNode",
          position: { x: 740, y: 50 },
          data: { label: "Success Out", outputName: "final_state", outputType: "Text" },
        },
      ];
      const cyclicEdges = [
        { id: "e-in-rot", source: "input-cyc", sourceHandle: "value", target: "router-cyc", targetHandle: "input" },
        { id: "e-rot-true", source: "router-cyc", sourceHandle: "trueBranch", target: "code-cyc", targetHandle: "inputData" },
        { id: "e-rot-false", source: "router-cyc", sourceHandle: "falseBranch", target: "output-cyc", targetHandle: "value" },
        // Loop back to form a cyclic loop
        { id: "loop-back", source: "code-cyc", sourceHandle: "result", target: "router-cyc", targetHandle: "input" },
      ];
      setNodes(cyclicNodes as any);
      setEdges(cyclicEdges as any);
      setViewport({ x: 50, y: 50, zoom: 0.9 });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none">
      {/* LEFT SIDEBAR PANEL: Drag and drop list */}
      <div className="w-[340px] flex flex-col bg-slate-900 border-r border-slate-800/80 z-20 shadow-2xl">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Pipeline Elements</h1>
              <p className="text-[10px] text-slate-400">Drag items to the canvas or click to add</p>
            </div>
          </div>
        </div>

        {/* Categories of components */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <span className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">
              Pipeline Templates
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => loadTemplate("translator")}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  activeTemplate === "translator"
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-300"
                    : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-violet-400" />
                  <span>Translate AI Assistant</span>
                </span>
                <span className="text-[9px] px-1 bg-slate-800 rounded font-normal text-slate-500">DAG</span>
              </button>

              <button
                onClick={() => loadTemplate("apipipeline")}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  activeTemplate === "apipipeline"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Database size={14} className="text-emerald-400" />
                  <span>Database Processing API</span>
                </span>
                <span className="text-[9px] px-1 bg-slate-800 rounded font-normal text-slate-500">DAG</span>
              </button>

              <button
                onClick={() => loadTemplate("cyclic")}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  activeTemplate === "cyclic"
                    ? "bg-rose-500/10 border-rose-500/50 text-rose-300"
                    : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <RotateCcw size={14} className="text-rose-400 animate-spin-slow" />
                  <span>Cyclic Looping Workflow</span>
                </span>
                <span className="text-[9px] px-1 bg-rose-500/20 rounded font-bold text-rose-400">CYCLE</span>
              </button>
            </div>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2.5">
              Available Node Toolbox ({nodeDefinitions.length})
            </span>
            <div className="space-y-2">
              {nodeDefinitions.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  className="group relative flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-850 cursor-grab hover:border-slate-700/80 active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start space-x-2.5">
                    <div className={`p-2 rounded-md border ${item.color.split(" ")[0]} ${item.color.split(" ")[1]} text-sm`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-slate-800/80 text-slate-400 rounded uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => spawnNode(item.type, item.initialData)}
                    className="p-1 rounded bg-slate-900 border border-slate-850 hover:border-slate-600 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Add Node Directly"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            VectorShift Abstraction Suite
          </p>
        </div>
      </div>

      {/* CENTRAL AREA: Workspace canvas header bar + main flow viewport */}
      <div className="flex-1 flex flex-col relative">
        {/* Main Canvas Header */}
        <header className="absolute top-0 left-0 right-0 h-14 bg-slate-900/60 border-b border-slate-805 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">
                Pipeline Dev Workspace
              </span>
              <h2 className="text-[13px] font-semibold text-slate-200">
                AI Visual Node Orchestrator
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>Canvas Tips</span>
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Clear Canvas</span>
            </button>
            <button
              onClick={submitPipeline}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              <span>Submit Pipeline</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE FLOW CANVAS */}
        <div className="flex-1 w-full h-full relative pt-14 text-slate-300">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#161f38" gap={24} size={1} />
            <Controls position="bottom-right" />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === "inputNode") return "#3b82f6";
                if (node.type === "outputNode") return "#f43f5e";
                if (node.type === "llmNode") return "#8b5cf6";
                if (node.type === "textNode") return "#14b8a6";
                return "#10b981";
              }}
              maskColor="rgba(0, 0, 0, 0.6)"
              style={{ height: 100, width: 140 }}
            />
          </ReactFlow>

          {/* Quick Help Tips */}
          {showTips && (
            <div className="absolute top-18 right-6 w-72 bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur z-20 space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">How to use</span>
                <button onClick={() => setShowTips(false)} className="text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <ul className="text-slate-400 text-[11px] space-y-2 list-disc list-inside">
                <li><strong className="text-slate-300">Layout Selection:</strong> Switch pipeline templates in the sidebar to review complex configurations.</li>
                <li><strong className="text-slate-300">Define Variables:</strong> Add a <strong className="text-slate-300">Text block</strong> and type double-curly brackets (e.g. <code className="text-teal-400 font-mono text-[10px] bg-slate-950 px-1 rounded">{"{{ variable }}"}</code>) to build real input handles on the left.</li>
                <li><strong className="text-slate-300">Build Connections:</strong> Click and drag a thread from any right pin to any left pin.</li>
                <li><strong className="text-slate-300">Integrations:</strong> Double click on connection threads to remove or select them. Click the trash icon on headers to remove blocks.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* RESULT MODAL (DAG / Pipeline Telemetry report) */}
      <AnimatePresence>
        {modalResult && modalResult.show && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className={`p-6 text-center ${modalResult.isDag ? "bg-gradient-to-b from-emerald-500/10" : "bg-gradient-to-b from-rose-500/10"}`}>
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {modalResult.isDag ? (
                    <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-full">
                      <CheckCircle size={32} />
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-500/15 text-rose-400 rounded-full animate-bounce">
                      <AlertTriangle size={32} />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {modalResult.isDag ? "Valid Directed Graph!" : "Graph Cycle Detected"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {modalResult.isDag
                    ? "Congratulations! The workflow forms a solid Directed Acyclic Graph."
                    : "The algorithm detected a feedback loop. Formulate connections in one-way streams."}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Total Nodes
                    </span>
                    <span className="text-2xl font-black text-slate-200 block mt-1">
                      {modalResult.nodesCount}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Total Edges
                    </span>
                    <span className="text-2xl font-black text-slate-200 block mt-1">
                      {modalResult.edgesCount}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      DAG Verification
                    </span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      Acyclic validation status
                    </span>
                  </div>
                  <div>
                    {modalResult.isDag ? (
                      <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                        Pass (Is DAG)
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
                        Fail (Has Cycle)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
                <button
                  onClick={() => setModalResult(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <BuilderWorkspace />
    </ReactFlowProvider>
  );
}
