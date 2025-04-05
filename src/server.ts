// MCPサーバーの実装
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool, // Tool 型をインポート
} from "@modelcontextprotocol/sdk/types.js";

import {
  LangfuseClient,
  QueryLLMMetricsArgs,
  GetTraceArgs,
  ListTracesArgs,
  ListAnnotationQueuesArgs,
  ListScoresArgs,
  GetSessionArgs,
} from "./clients/langfuse.js";
import { getTools } from "./tools/index.js";

export class LangfuseMCPServer {
  private server: Server;
  private langfuseClient: LangfuseClient;

  constructor(domain: string, publicKey: string, privateKey: string) {
    // Langfuseクライアントを初期化
    this.langfuseClient = new LangfuseClient(domain, publicKey, privateKey);

    // ツール定義を取得し、オブジェクトに変換
    const toolsArray = getTools();
    const toolsObject = toolsArray.reduce((acc, tool) => {
      acc[tool.name] = tool;
      return acc;
    }, {} as Record<string, Tool>); // Tool 型を使用

    // サーバーを初期化
    this.server = new Server(
      {
        name: "mcp-server-langfuse", // サーバー名を修正 (より具体的に)
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: toolsObject, // 取得したツールオブジェクトを設定
        },
      }
    );

    // リクエストハンドラを設定
    this.setupRequestHandlers();
  }

  private setupRequestHandlers(): void {
    // ツール呼び出しハンドラ
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => {
        console.error("Received CallToolRequest:", request);
        try {
          if (!request.params.arguments) {
            throw new Error("No arguments provided");
          }

          switch (request.params.name) {
            // 既存のツール
            case "query_llm_metrics": {
              const args = request.params.arguments as unknown as QueryLLMMetricsArgs;
              const response = await this.langfuseClient.getLLMMetricsByTimeRange(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: トレース情報取得
            case "get_trace_by_id": {
              const args = request.params.arguments as unknown as GetTraceArgs;
              const response = await this.langfuseClient.getTraceById(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: トレースリスト取得
            case "list_traces": {
              const args = request.params.arguments as unknown as ListTracesArgs;
              const response = await this.langfuseClient.listTraces(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: アノテーションキューリスト取得
            case "list_annotation_queues": {
              const args = request.params.arguments as unknown as ListAnnotationQueuesArgs;
              const response = await this.langfuseClient.listAnnotationQueues(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: スコアリスト取得
            case "list_scores": {
              const args = request.params.arguments as unknown as ListScoresArgs;
              const response = await this.langfuseClient.listScores(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: セッション情報取得
            case "get_session": {
              const args = request.params.arguments as unknown as GetSessionArgs;
              const response = await this.langfuseClient.getSession(args);
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }
            
            // 新規追加ツール: プロジェクト情報取得
            case "get_projects": {
              const response = await this.langfuseClient.getProjects();
              return {
                content: [{ type: "text", text: JSON.stringify(response) }],
              };
            }

            default:
              throw new Error(`Unknown tool: ${request.params.name}`);
          }
        } catch (error) {
          console.error("Error executing tool:", error);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  error: error instanceof Error ? error.message : String(error),
                }),
              },
            ],
          };
        }
      }
    );

    // ツール一覧リクエストハンドラ
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.error("Received ListToolsRequest");
      return {
        tools: getTools(),
      };
    });
  }

  // サーバー起動メソッド
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    console.error("Connecting server to transport...");
    await this.server.connect(transport);
    console.error("Langfuse MCP Server running on stdio");
  }
}