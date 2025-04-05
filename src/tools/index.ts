// Langfuse MCPサーバーのツール定義
import { Tool } from "@modelcontextprotocol/sdk/types.js";

// LLMメトリクスを取得するツールの定義
export const queryLLMMetricsTool: Tool = {
  name: "query_llm_metrics",
  description: "Query LLM metrics from Langfuse",
  inputSchema: {
    type: "object",
    properties: {
      fromTimestamp: {
        type: "string",
        description: "Start timestamp in ISO 8601 format",
      },
      toTimestamp: {
        type: "string",
        description: "End timestamp in ISO 8601 format",
      },
      page: {
        type: "number",
        description: "Page number (default 1)",
        default: 1,
      },
      limit: {
        type: "number",
        description: "Results per page limit (default 100)",
        default: 100,
      },
      traceName: {
        type: "string",
        description: "Filter by trace name",
      },
      userId: {
        type: "string",
        description: "Filter by user ID",
      },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Filter by tags",
      },
      environment: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Filter by environment",
      },
    },
  },
};

// 特定のトレース情報を取得するツールの定義
export const getTraceByIdTool: Tool = {
  name: "get_trace_by_id",
  description: "Get trace details by ID from Langfuse",
  inputSchema: {
    type: "object",
    properties: {
      traceId: {
        type: "string",
        description: "Langfuse trace identifier",
      },
    },
    required: ["traceId"],
  },
};

// トレースのリストを取得するツールの定義
export const listTracesTool: Tool = {
  name: "list_traces",
  description: "List traces from Langfuse with filtering options",
  inputSchema: {
    type: "object",
    properties: {
      page: {
        type: "number",
        description: "Page number (default 1)",
      },
      limit: {
        type: "number", 
        description: "Results per page limit",
      },
      userId: {
        type: "string",
        description: "Filter by user ID",
      },
      name: {
        type: "string",
        description: "Filter by trace name",
      },
      sessionId: {
        type: "string",
        description: "Filter by session ID",
      },
      fromTimestamp: {
        type: "string",
        description: "Filter traces on or after this timestamp (ISO 8601)",
      },
      toTimestamp: {
        type: "string",
        description: "Filter traces before this timestamp (ISO 8601)",
      },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Filter by tags (all tags must be present)",
      },
      environment: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Filter by environment",
      },
    },
  },
};

// アノテーションキューのリストを取得するツールの定義
export const listAnnotationQueuesTool: Tool = {
  name: "list_annotation_queues",
  description: "List annotation queues from Langfuse",
  inputSchema: {
    type: "object",
    properties: {
      page: {
        type: "number",
        description: "Page number (default 1)",
      },
      limit: {
        type: "number",
        description: "Results per page limit",
      },
    },
  },
};

// スコアのリストを取得するツールの定義
export const listScoresTool: Tool = {
  name: "list_scores",
  description: "List scores from Langfuse with filtering options",
  inputSchema: {
    type: "object",
    properties: {
      page: {
        type: "number",
        description: "Page number (default 1)",
      },
      limit: {
        type: "number",
        description: "Results per page limit",
      },
      name: {
        type: "string",
        description: "Filter by score name",
      },
      userId: {
        type: "string",
        description: "Filter by user ID",
      },
      environment: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Filter by environment",
      },
    },
  },
};

// セッション情報を取得するツールの定義
export const getSessionTool: Tool = {
  name: "get_session",
  description: "Get session details by ID from Langfuse",
  inputSchema: {
    type: "object",
    properties: {
      sessionId: {
        type: "string",
        description: "Langfuse session identifier",
      },
    },
    required: ["sessionId"],
  },
};

// プロジェクト情報を取得するツールの定義
export const getProjectsTool: Tool = {
  name: "get_projects",
  description: "Get information about projects associated with the API key",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

// ツール一覧を取得する関数
export function getTools(): Tool[] {
  return [
    queryLLMMetricsTool,
    getTraceByIdTool,
    listTracesTool,
    listAnnotationQueuesTool,
    listScoresTool, 
    getSessionTool,
    getProjectsTool,
  ];
}