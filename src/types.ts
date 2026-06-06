export interface BaseNodeData {
  label: string;
  [key: string]: any;
}

export interface InputNodeData extends BaseNodeData {
  inputName: string;
  inputType: "Text" | "File" | "Table" | "Image";
}

export interface OutputNodeData extends BaseNodeData {
  outputName: string;
  outputType: "Text" | "JSON" | "File" | "Markdown";
}

export interface LLMNodeData extends BaseNodeData {
  prompt: string;
  systemPrompt: string;
  temperature: number;
  model: "gemini-2.5-flash" | "gemini-1.5-pro" | "gemini-1.5-flash";
}

export interface TextNodeData extends BaseNodeData {
  text: string;
  variables: string[];
}

export interface DatabaseNodeData extends BaseNodeData {
  table: string;
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  query: string;
}

export interface HTTPNodeData extends BaseNodeData {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: string;
}

export interface TranslatorNodeData extends BaseNodeData {
  sourceLanguage: string;
  targetLanguage: string;
}

export interface CodeNodeData extends BaseNodeData {
  language: "javascript" | "python" | "bash";
  code: string;
}

export interface RouterNodeData extends BaseNodeData {
  condition: string;
  ruleValue: string;
}
