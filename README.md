# 受付状況API - TypeScript版

TypeScriptとServerless Frameworkを使用したAWS Lambda HTTP APIプロジェクトです。受付状況に関する情報を提供するAPIを実装しています。

## プロジェクト概要

このAPIは、時間帯に基づいて受付状況を判定し、新規契約や機種変更などのサービスカテゴリごとの利用可否情報を返します。

### 主な機能

- **受付時間判定**: 4:00〜23:15の受付時間に基づく状況判定
- **カテゴリ別利用可否**: 各サービスカテゴリの利用可能状態
- **リアルタイム状況更新**: 現在時刻に基づく動的な状況更新

## API仕様

### エンドポイント

#### 1. ヘルスチェック
- **URL**: `GET /`
- **説明**: APIの動作確認用エンドポイント

**レスポンス例:**
```json
{
  "message": "Go Serverless v4! Your function executed successfully!"
}
```

#### 2. 受付状況取得
- **URL**: `GET /reception-status`
- **説明**: 現在の受付状況とサービスカテゴリの利用可否を取得

**レスポンス例:**
```json
{
  "categories": {
    "newPhoneAndDeviceChange": {
      "items": [
        "新しい電話番号、機種変更",
        "SIM再発行・タイプ変更"
      ],
      "isAvailable": true
    },
    "carrierSwitch": {
      "items": [
        "⚫︎⚫︎⚫︎⚫︎・△△△△△から乗り換え",
        "他社から乗り換え"
      ],
      "isAvailable": true
    }
  },
  "receptionInfo": {
    "status": "受付中",
    "hours": "(4:00~23:15)",
    "isAccepting": true
  }
}
```

### 受付状況の判定ロジック

- **受付時間**: 4:00〜23:15
- **受付中**: 受付時間内（23:00前）
- **まもなく終了**: 23:00〜23:15
- **受付時間外**: 23:16〜3:59

## プロジェクト構成

```
get-response-api/
├── src/
│   ├── handler.ts                    # メインハンドラー
│   └── types/
│       └── ReceptionStatusText.ts    # 型定義
├── dist/                             # コンパイル後のファイル
├── serverless.yml                    # Serverless設定
├── tsconfig.json                     # TypeScript設定
└── package.json                      # npm設定
```

## 技術スタック

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Framework**: Serverless Framework v4
- **Cloud**: AWS Lambda + API Gateway
- **Build Tool**: TypeScript Compiler

## 開発環境セットアップ

### 必要な依存関係

```bash
# TypeScript関連（必須）
npm install --save-dev typescript @types/node @types/aws-lambda

# ローカル開発用
npm install --save-dev serverless-offline
```

**⚠️ 注意**: Serverless v4では`serverless-plugin-typescript`は**不要**です。

### ビルドとテスト

```bash
# TypeScriptコンパイル
npm run build

# ローカル開発サーバー起動
serverless offline

# APIテスト
curl http://localhost:3000/
curl http://localhost:3000/reception-status
```

## デプロイとリソースの削除
awsにデプロイする。

```sh
serverless deploy
```

awsのリソースの削除

```sh
serverless remove
```

## 型定義

### ReceptionStatusTextResponse

```typescript
interface ReceptionStatusTextResponse {
  categories: {
    newPhoneAndDeviceChange: {
      items: string[];
      isAvailable: boolean;
    };
    carrierSwitch: {
      items: string[];
      isAvailable: boolean;
    };
  };
  receptionInfo: {
    status: string;        // "受付中" | "受付時間外" | "まもなく終了"
    hours: string;         // 営業時間情報
    isAccepting: boolean;  // 受付可能フラグ
  };
}
```

## CORS設定

APIは `Access-Control-Allow-Origin: *` を設定しており、クロスオリジンリクエストに対応しています。

## エラーハンドリング

- **500 Internal Server Error**: サーバー内部エラー時に返却
- エラー時は以下の形式でレスポンス:
```json
{
  "error": "Internal Server Error"
}
```

## Serverless v4 TypeScript対応

Serverless Framework v4では、TypeScriptサポートが組み込まれているため、従来のプラグインとは異なる設定が必要です。

### よくあるエラーと解決策

#### ❌ エラー例
```
ServerlessError2: Serverless now includes ESBuild and supports Typescript out-of-the-box. But this conflicts with the plugin 'serverless-plugin-typescript'.
```

#### ✅ 解決方法

**1. 競合するプラグインを削除**
```bash
npm uninstall serverless-plugin-typescript
```

**2. serverless.ymlから競合設定を削除**
```yaml
# 削除する設定
plugins:
  - serverless-plugin-typescript  # これを削除

build:
  esbuild: false  # これも削除
```

**3. 正しいserverless.yml設定**
```yaml
# Serverless v4のTypeScript対応設定
service: get-response-api

provider:
  name: aws
  runtime: nodejs20.x

plugins:
  - serverless-offline  # ローカル開発用のみ

functions:
  hello:
    handler: src/handler.hello
    events:
      - httpApi:
          path: /
          method: get
  getReceptionStatusText:
    handler: src/handler.getReceptionStatusText
    events:
      - httpApi:
          path: /reception-status
          method: get
```

### 構築手順

#### 1. プロジェクト初期化
```bash
# package.json作成
npm init -y

# TypeScript関連の依存関係をインストール
npm install --save-dev typescript @types/node @types/aws-lambda

# ローカル開発用プラグイン
npm install --save-dev serverless-offline
```

#### 2. TypeScript設定ファイル作成
```bash
# tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. ディレクトリ構造作成
```bash
mkdir src
mkdir src/types
```

#### 4. TypeScriptファイル作成
- `src/handler.ts` - メインハンドラー
- `src/types/ReceptionStatusText.ts` - 型定義

#### 5. 動作確認
```bash
# TypeScriptコンパイルテスト
npm run build

# ローカル開発サーバー起動
serverless offline
```

### 重要なポイント

- **Serverless v4の組み込みサポート**: 追加のTypeScriptプラグインは不要
- **ESBuildによる自動コンパイル**: TypeScriptファイルは自動的にコンパイルされる
- **プラグイン競合に注意**: `serverless-plugin-typescript`は使用しない
- **ハンドラーパス**: `src/handler.ts`のようにTypeScriptファイルを直接指定

### ローカル開発

```bash
# ローカルサーバー起動
serverless offline

# API テスト
curl http://localhost:3000/
curl http://localhost:3000/reception-status
```

### 依存関係

**必須**
- `typescript`: TypeScriptコンパイラ
- `@types/node`: Node.jsの型定義
- `@types/aws-lambda`: AWS Lambdaの型定義

**開発用**
- `serverless-offline`: ローカル開発サーバー　