import React, { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  FileText,
  Database,
  Globe,
  Settings,
  Cpu,
  ArrowRight,
  ArrowLeftRight,
  Code,
  Compass,
} from "lucide-react";
import BaseNode from "./BaseNode";
import {
  InputNodeData,
  OutputNodeData,
  LLMNodeData,
  TextNodeData,
  DatabaseNodeData,
  HTTPNodeData,
  TranslatorNodeData,
  CodeNodeData,
  RouterNodeData,
} from "../types";

// ==========================================
// 1. INPUT NODE
// ==========================================
export function InputNode({ id, data, selected }: { id: string; data: InputNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, inputName: e.target.value } } : n))
    );
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, inputType: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-blue-950/90",
    headerText: "text-blue-100",
    borderAccent: "border-blue-500",
    tagBg: "bg-blue-500/20",
    tagText: "text-blue-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Input Variable"}
      icon={<FileText size={16} />}
      category="Input"
      styleClass={theme}
      outputs={[{ id: "value", label: "output" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Variable Name
          </label>
          <input
            type="text"
            value={data.inputName || ""}
            onChange={handleNameChange}
            placeholder="e.g. user_prompt"
            className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Expected Type
          </label>
          <select
            value={data.inputType || "Text"}
            onChange={handleTypeChange}
            className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="Text">Text String</option>
            <option value="File">Document / File</option>
            <option value="Table">Structured Table</option>
            <option value="Image">Image Buffer</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 2. OUTPUT NODE
// ==========================================
export function OutputNode({ id, data, selected }: { id: string; data: OutputNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, outputName: e.target.value } } : n))
    );
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, outputType: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-rose-950/90",
    headerText: "text-rose-100",
    borderAccent: "border-rose-500",
    tagBg: "bg-rose-500/20",
    tagText: "text-rose-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Response Output"}
      icon={<Settings size={16} />}
      category="Output"
      styleClass={theme}
      inputs={[{ id: "value", label: "input" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Output Name
          </label>
          <input
            type="text"
            value={data.outputName || ""}
            onChange={handleNameChange}
            placeholder="e.g. final_response"
            className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Format Style
          </label>
          <select
            value={data.outputType || "Text"}
            onChange={handleTypeChange}
            className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
          >
            <option value="Text">Raw Plain Text</option>
            <option value="JSON">Structured JSON</option>
            <option value="File">Downloadable File</option>
            <option value="Markdown">Formatted Markdown</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 3. LLM NODE
// ==========================================
export function LLMNode({ id, data, selected }: { id: string; data: LLMNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, systemPrompt: e.target.value } } : n))
    );
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, prompt: e.target.value } } : n))
    );
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, model: e.target.value } } : n))
    );
  };

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, temperature: parseFloat(e.target.value) } } : n))
    );
  };

  const theme = {
    headerBg: "bg-violet-950/90",
    headerText: "text-violet-100",
    borderAccent: "border-violet-500",
    tagBg: "bg-violet-500/20",
    tagText: "text-violet-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "AI Model Inference"}
      icon={<Cpu size={16} />}
      category="LLM"
      styleClass={theme}
      inputs={[
        { id: "systemPrompt", label: "system" },
        { id: "prompt", label: "prompt" },
      ]}
      outputs={[{ id: "response", label: "response" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            LLM Model Target
          </label>
          <select
            value={data.model || "gemini-2.5-flash"}
            onChange={handleModelChange}
            className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-violet-500"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep reasoning)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Inherent System Instructions
          </label>
          <textarea
            value={data.systemPrompt || ""}
            onChange={handleSystemPromptChange}
            placeholder="You are a helpful and structured assistant..."
            rows={2}
            className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Prompt Template
          </label>
          <textarea
            value={data.prompt || ""}
            onChange={handlePromptChange}
            placeholder="Structure: Translate the text: {{text}}"
            rows={2}
            className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            <span>Temperature</span>
            <span className="font-mono text-violet-400">{(data.temperature ?? 0.7).toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={data.temperature ?? 0.7}
            onChange={handleTempChange}
            className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
          />
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 4. TEXT NODE
// ==========================================
export function TextNode({ id, data, selected }: { id: string; data: TextNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const textValue = data.text || "";

  // Dynamic automatic height resizing based on content scrolling density
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Add a clean gutter padding of 4px
      textareaRef.current.style.height = `${Math.max(68, scrollHeight)}px`;
    }
  }, [textValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textVal = e.target.value;

    // JS variable regex: find anything inside {{ var }} where var is word characters
    const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const foundVars: string[] = [];
    let match;
    while ((match = variableRegex.exec(textVal)) !== null) {
      if (!foundVars.includes(match[1])) {
        foundVars.push(match[1]);
      }
    }

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: {
              ...n.data,
              text: textVal,
              variables: foundVars,
            },
          };
        }
        return n;
      })
    );
  };

  const theme = {
    headerBg: "bg-teal-950/90",
    headerText: "text-teal-100",
    borderAccent: "border-teal-500",
    tagBg: "bg-teal-500/20",
    tagText: "text-teal-300",
  };

  // Convert array of variable strings to corresponding NodeHandleDefine inputs on left side
  const inputHandles = (data.variables || []).map((v) => ({
    id: v,
    label: v,
  }));

  // Smooth, premium width scaling using JetBrains Mono layout metrics (7.4px avg width per character)
  const lines = textValue.split("\n");
  const longestLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const calculatedWidth = Math.min(550, Math.max(280, longestLineLength * 7.4 + 54));

  return (
    <BaseNode
      id={id}
      title={data.label || "Query String / Text"}
      icon={<FileText size={16} />}
      category="Text block"
      styleClass={theme}
      inputs={inputHandles}
      outputs={[{ id: "output", label: "text" }]}
      selected={selected}
      cardStyle={{ width: `${calculatedWidth}px` }}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <span>Query / Input Block</span>
          {data.variables && data.variables.length > 0 && (
            <span className="text-[9px] text-teal-400 font-bold tracking-wide">
              {data.variables.length} active var{data.variables.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={handleTextChange}
            placeholder="Type code or notes. Use {{ variable_name }} to form a connection pin on the left."
            className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed resize-none overflow-hidden transition-all duration-100"
            style={{ minHeight: "68px" }}
          />
        </div>
        {data.variables && data.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.variables.map((v) => (
              <span key={v} className="px-1.5 py-0.5 text-[9px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
}

// ==========================================
// 5. DATABASE NODE (New Custom #1)
// ==========================================
export function DatabaseNode({ id, data, selected }: { id: string; data: DatabaseNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, table: e.target.value } } : n))
    );
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, operation: e.target.value } } : n))
    );
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, query: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-emerald-950/90",
    headerText: "text-emerald-100",
    borderAccent: "border-emerald-500",
    tagBg: "bg-emerald-500/20",
    tagText: "text-emerald-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Relational SQL Query"}
      icon={<Database size={16} />}
      category="Database"
      styleClass={theme}
      inputs={[{ id: "params", label: "parameters" }]}
      outputs={[{ id: "rows", label: "dataset" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Operation
            </label>
            <select
              value={data.operation || "SELECT"}
              onChange={handleOperationChange}
              className="w-full px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="SELECT">SELECT</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Schema Table
            </label>
            <input
              type="text"
              value={data.table || ""}
              onChange={handleTableChange}
              placeholder="users"
              className="w-full px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Condition Statement / Raw SQL
          </label>
          <textarea
            value={data.query || ""}
            onChange={handleQueryChange}
            placeholder="SELECT * FROM table WHERE id = {{params}}"
            rows={2}
            className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 font-mono placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 6. HTTP CLIENT NODE (New Custom #2)
// ==========================================
export function HTTPNode({ id, data, selected }: { id: string; data: HTTPNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, url: e.target.value } } : n))
    );
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, method: e.target.value } } : n))
    );
  };

  const handleHeadersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, headers: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-sky-950/90",
    headerText: "text-sky-100",
    borderAccent: "border-sky-500",
    tagBg: "bg-sky-500/20",
    tagText: "text-sky-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "HTTP Request"}
      icon={<Globe size={16} />}
      category="REST API"
      styleClass={theme}
      inputs={[{ id: "payload", label: "payload" }]}
      outputs={[
        { id: "response", label: "response" },
        { id: "status", label: "status" },
      ]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex space-x-2">
          <div className="w-1/3">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Method
            </label>
            <select
              value={data.method || "GET"}
              onChange={handleMethodChange}
              className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="w-2/3">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Target URL
            </label>
            <input
              type="text"
              value={data.url || ""}
              onChange={handleUrlChange}
              placeholder="https://api.site.com"
              className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Request Headers (JSON)
          </label>
          <textarea
            value={data.headers || ""}
            onChange={handleHeadersChange}
            placeholder='{ "Content-Type": "application/json" }'
            rows={2}
            className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 font-mono placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 7. LANGUAGE TRANSLATOR NODE (New Custom #3)
// ==========================================
export function TranslatorNode({ id, data, selected }: { id: string; data: TranslatorNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleSourceLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, sourceLanguage: e.target.value } } : n))
    );
  };

  const handleTargetLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, targetLanguage: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-indigo-950/90",
    headerText: "text-indigo-100",
    borderAccent: "border-indigo-500",
    tagBg: "bg-indigo-500/20",
    tagText: "text-indigo-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Language Translator"}
      icon={<ArrowLeftRight size={16} />}
      category="Translation"
      styleClass={theme}
      inputs={[{ id: "text", label: "source_text" }]}
      outputs={[{ id: "translated", label: "tar_text" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Source
            </label>
            <select
              value={data.sourceLanguage || "Auto"}
              onChange={handleSourceLang}
              className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Auto">Detect Lang</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Target
            </label>
            <select
              value={data.targetLanguage || "Spanish"}
              onChange={handleTargetLang}
              className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
              <option value="Hindi">Hindi</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 text-center italic">
          Translates incoming streams dynamically.
        </p>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 8. CODE SANDBOX NODE (New Custom #4)
// ==========================================
export function CodeNode({ id, data, selected }: { id: string; data: CodeNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, language: e.target.value } } : n))
    );
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, code: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-amber-950/90",
    headerText: "text-amber-100",
    borderAccent: "border-amber-500",
    tagBg: "bg-amber-500/20",
    tagText: "text-amber-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Script Sandbox"}
      icon={<Code size={16} />}
      category="Code Execution"
      styleClass={theme}
      inputs={[{ id: "inputData", label: "input" }]}
      outputs={[{ id: "result", label: "output" }]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Sandbox Runtime
          </label>
          <select
            value={data.language || "javascript"}
            onChange={handleLanguageChange}
            className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="javascript">JavaScript ES6</option>
            <option value="python">Python 3.11</option>
            <option value="bash">Bash Script</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Inline Executable Handler
          </label>
          <textarea
            value={data.code || ""}
            onChange={handleCodeChange}
            placeholder={`function main(input) {\n  return input.toUpperCase();\n}`}
            rows={3}
            className="w-full p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500 leading-normal"
          />
        </div>
      </div>
    </BaseNode>
  );
}

// ==========================================
// 9. LOGIC ROUTER NODE (New Custom #5)
// ==========================================
export function RouterNode({ id, data, selected }: { id: string; data: RouterNodeData; selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, condition: e.target.value } } : n))
    );
  };

  const handleRuleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ruleValue: e.target.value } } : n))
    );
  };

  const theme = {
    headerBg: "bg-fuchsia-950/90",
    headerText: "text-fuchsia-100",
    borderAccent: "border-fuchsia-500",
    tagBg: "bg-fuchsia-500/20",
    tagText: "text-fuchsia-300",
  };

  return (
    <BaseNode
      id={id}
      title={data.label || "Logic router"}
      icon={<Compass size={16} />}
      category="Condition Routing"
      styleClass={theme}
      inputs={[{ id: "input", label: "input" }]}
      outputs={[
        { id: "trueBranch", label: "true" },
        { id: "falseBranch", label: "false" },
      ]}
      selected={selected}
    >
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Conditional Test
          </label>
          <select
            value={data.condition || "equals"}
            onChange={handleConditionChange}
            className="w-full px-2 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-fuchsia-500"
          >
            <option value="equals">Equals (==)</option>
            <option value="contains">Contains String</option>
            <option value="gt">Greater Than (&gt;)</option>
            <option value="lt">Less Than (&lt;)</option>
            <option value="notEmpty">Is Not Empty</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Match Value
          </label>
          <input
            type="text"
            value={data.ruleValue || ""}
            onChange={handleRuleValue}
            placeholder="Match query / limit..."
            className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-fuchsia-500"
          />
        </div>
      </div>
    </BaseNode>
  );
}
