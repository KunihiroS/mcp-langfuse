// LangfuseクライアントはLangfuse APIと通信するためのクライアントクラスです
// Node.js標準のURLSearchParamsを使用
import { URLSearchParams } from 'url';

// LLM Metrics Response Interface
export interface LLMMetricsResponse {
  data: Array<{
    date: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Type definitions for tool arguments
export interface QueryLLMMetricsArgs {
  fromTimestamp: string; // ISO 8601 format
  toTimestamp: string; // ISO 8601 format
  page?: number; // default 1
  limit?: number; // default 100
  traceName?: string;
  userId?: string;
  tags?: string[];
  environment?: string[];
}

// トレース取得のための引数インターフェース
export interface GetTraceArgs {
  traceId: string; // Langfuseトレース識別子
}

// トレースリスト取得のための引数インターフェース
export interface ListTracesArgs {
  page?: number;
  limit?: number;
  userId?: string;
  name?: string;
  sessionId?: string;
  fromTimestamp?: string;
  toTimestamp?: string;
  tags?: string[];
  environment?: string[];
}

// アノテーションキュー取得のための引数インターフェース
export interface ListAnnotationQueuesArgs {
  page?: number;
  limit?: number;
}

// スコア取得のための引数インターフェース
export interface ListScoresArgs {
  page?: number;
  limit?: number;
  name?: string;
  userId?: string;
  environment?: string[];
}

// セッション取得のための引数インターフェース
export interface GetSessionArgs {
  sessionId: string;
}

// Function to validate ISO 8601 timestamp format
export function isValidISOTimestamp(timestamp: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return regex.test(timestamp);
}

export class LangfuseClient {
  private apiHeader: { Authorization: string, "Content-Type": string };
  private domain: string;

  constructor(domain: string, public_key: string, private_key: string) {
    this.domain = domain

    // Node.js環境用のBase64エンコード
    const credentials = `${public_key}:${private_key}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    this.apiHeader = {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/json",
    };
  }

  async getLLMMetricsByTimeRange(payload: QueryLLMMetricsArgs): Promise<LLMMetricsResponse> {
    // タイムスタンプのバリデーション
    if (!isValidISOTimestamp(payload.fromTimestamp) || !isValidISOTimestamp(payload.toTimestamp)) {
      throw new Error('Invalid timestamp format. Expected ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)');
    }

    const params = new URLSearchParams({
      fromTimestamp: payload.fromTimestamp,
      toTimestamp: payload.toTimestamp,
      page: payload.page?.toString() || '1',
      limit: payload.limit?.toString() || '100',
      traceName: payload.traceName || '',
      userId: payload.userId || '',
      tags: payload.tags?.join(',') || '',
      environment: payload.environment?.join(',') || '',
    });

    const response = await fetch(
      `${this.domain}/api/public/metrics/daily?${params}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    // レスポンスステータスのチェック
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json() as LLMMetricsResponse;
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 特定のトレース情報を取得する
  async getTraceById(payload: GetTraceArgs): Promise<any> {
    if (!payload.traceId) {
      throw new Error('traceId is required');
    }

    const response = await fetch(
      `${this.domain}/api/public/traces/${encodeURIComponent(payload.traceId)}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // トレースのリストを取得する
  async listTraces(payload: ListTracesArgs): Promise<any> {
    const params = new URLSearchParams();
    
    if (payload.page) params.append('page', payload.page.toString());
    if (payload.limit) params.append('limit', payload.limit.toString());
    if (payload.userId) params.append('userId', payload.userId);
    if (payload.name) params.append('name', payload.name);
    if (payload.sessionId) params.append('sessionId', payload.sessionId);
    if (payload.fromTimestamp) params.append('fromTimestamp', payload.fromTimestamp);
    if (payload.toTimestamp) params.append('toTimestamp', payload.toTimestamp);
    if (payload.tags && payload.tags.length > 0) params.append('tags', payload.tags.join(','));
    if (payload.environment && payload.environment.length > 0) params.append('environment', payload.environment.join(','));

    const response = await fetch(
      `${this.domain}/api/public/traces?${params}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // アノテーションキューのリストを取得する
  async listAnnotationQueues(payload: ListAnnotationQueuesArgs = {}): Promise<any> {
    const params = new URLSearchParams();
    
    if (payload.page) params.append('page', payload.page.toString());
    if (payload.limit) params.append('limit', payload.limit.toString());

    const response = await fetch(
      `${this.domain}/api/public/annotation-queues?${params}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // スコアのリストを取得する
  async listScores(payload: ListScoresArgs = {}): Promise<any> {
    const params = new URLSearchParams();
    
    if (payload.page) params.append('page', payload.page.toString());
    if (payload.limit) params.append('limit', payload.limit.toString());
    if (payload.name) params.append('name', payload.name);
    if (payload.userId) params.append('userId', payload.userId);
    if (payload.environment && payload.environment.length > 0) params.append('environment', payload.environment.join(','));

    const response = await fetch(
      `${this.domain}/api/public/scores?${params}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // セッション情報を取得する
  async getSession(payload: GetSessionArgs): Promise<any> {
    if (!payload.sessionId) {
      throw new Error('sessionId is required');
    }

    const response = await fetch(
      `${this.domain}/api/public/sessions/${encodeURIComponent(payload.sessionId)}`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // プロジェクト情報を取得する
  async getProjects(): Promise<any> {
    const response = await fetch(
      `${this.domain}/api/public/projects`,
      {
        headers: this.apiHeader,
        method: 'GET'
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Langfuse API error (${response.status}): ${errorText}`);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Langfuse API response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}