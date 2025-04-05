#!/usr/bin/env node
// Langfuse MCP Server エントリーポイント
import { LangfuseMCPServer } from "./server.js";

/**
 * メイン関数
 * 環境変数からLangfuse APIの認証情報を取得し、サーバーを起動します
 */
async function main() {
  // 環境変数から認証情報を取得
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const privateKey = process.env.LANGFUSE_PRIVATE_KEY;
  const domain = process.env.LANGFUSE_DOMAIN || "https://api.langfuse.com";

  // 認証情報のチェック
  if (!publicKey || !privateKey) {
    console.error(
      "ERROR: 環境変数 LANGFUSE_PUBLIC_KEY と LANGFUSE_PRIVATE_KEY を設定してください"
    );
    process.exit(1);
  }
  
  console.error("Langfuse MCP Server を起動しています...");
  
  try {
    // サーバーのインスタンスを作成して起動
    const server = new LangfuseMCPServer(domain, publicKey, privateKey);
    await server.start();
  } catch (error) {
    console.error("サーバー起動中にエラーが発生しました:", error);
    process.exit(1);
  }
}

// メイン関数を実行
main().catch((error) => {
  console.error("致命的なエラーが発生しました:", error);
  process.exit(1);
});