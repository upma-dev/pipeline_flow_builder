import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Trash2 } from "lucide-react";

export interface NodeHandleDefine {
  id: string;
  label?: string;
  type?: "target" | "source";
  position?: Position;
}

interface BaseNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: string;
  styleClass?: {
    headerBg: string;
    headerText: string;
    borderAccent: string;
    tagBg: string;
    tagText: string;
  };
  cardStyle?: React.CSSProperties;
  inputs?: NodeHandleDefine[];
  outputs?: NodeHandleDefine[];
  selected?: boolean;
  children?: React.ReactNode;
}

export default function BaseNode({
  id,
  title,
  icon,
  category,
  styleClass = {
    headerBg: "bg-slate-900/85",
    headerText: "text-slate-100",
    borderAccent: "border-slate-800 focus-within:border-blue-500",
    tagBg: "bg-slate-800",
    tagText: "text-slate-400",
  },
  cardStyle,
  inputs = [],
  outputs = [],
  selected = false,
  children,
}: BaseNodeProps) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div
      id={`node-${id}`}
      style={cardStyle}
      className={`min-w-[260px] ${cardStyle?.width ? "" : "max-w-[340px]"} bg-slate-900/95 border-2 rounded-xl shadow-2xl transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-blue-900/10 ${
        selected
          ? "border-blue-500 shadow-blue-500/20 shadow-lg scale-[1.01]"
          : `border-slate-800/80`
      }`}
    >
      {/* Handles on Left (Inputs) */}
      <div className="absolute top-0 bottom-0 -left-1.5 flex flex-col justify-center space-y-4 pointer-events-none">
        {inputs.map((h, i) => {
          const positionY = inputs.length > 1 ? `${((i + 1) / (inputs.length + 1)) * 100}%` : "50%";
          return (
            <div
              key={h.id}
              className="relative flex items-center"
              style={{
                position: "absolute",
                top: positionY,
                transform: "translateY(-50%)",
              }}
            >
              <Handle
                type={h.type || "target"}
                position={h.position || Position.Left}
                id={h.id}
                className="!pointer-events-auto"
              />
              {h.label && (
                <span className="absolute left-4 bg-slate-950/80 text-[10px] font-mono text-slate-400 border border-slate-800 px-1 rounded whitespace-nowrap pointer-events-none">
                  {h.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Header Panel */}
      <div className={`flex items-center justify-between p-3 border-b border-slate-800/80 rounded-t-xl ${styleClass.headerBg}`}>
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-slate-950/50 text-blue-400">
            {icon}
          </div>
          <div>
            <h3 className={`text-xs font-semibold tracking-wide ${styleClass.headerText}`}>
              {title}
            </h3>
            <span className={`inline-block px-1.5 py-0.5 mt-0.5 text-[9px] font-bold rounded tracking-wider uppercase ${styleClass.tagBg} ${styleClass.tagText}`}>
              {category}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-950/30 transition-colors"
          title="Delete Node"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Body Area */}
      {children && (
        <div className="p-4 space-y-3.5 text-xs text-slate-300">
          {children}
        </div>
      )}

      {/* Handles on Right (Outputs) */}
      <div className="absolute top-0 bottom-0 -right-1.5 flex flex-col justify-center space-y-4 pointer-events-none">
        {outputs.map((h, i) => {
          const positionY = outputs.length > 1 ? `${((i + 1) / (outputs.length + 1)) * 100}%` : "50%";
          return (
            <div
              key={h.id}
              className="relative flex items-center justify-end"
              style={{
                position: "absolute",
                top: positionY,
                transform: "translateY(-50%)",
              }}
            >
              {h.label && (
                <span className="absolute right-4 bg-slate-950/80 text-[10px] font-mono text-slate-400 border border-slate-800 px-1 rounded whitespace-nowrap pointer-events-none">
                  {h.label}
                </span>
              )}
              <Handle
                type={h.type || "source"}
                position={h.position || Position.Right}
                id={h.id}
                className="!pointer-events-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
