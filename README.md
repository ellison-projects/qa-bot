# qa-bot

A server-side TypeScript application for crawling websites and identifying SEO and technical concerns.

## Overview

qa-bot is designed to analyze websites for:

- SEO issues (missing meta tags, poor heading structure, duplicate content, etc.)
- Technical concerns (broken links, slow page loads, accessibility problems, etc.)

The project is currently in early development / stub phase.

## Requirements

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+

## Getting Started

Install dependencies:

```bash
npm install
```

### Scripts

**Ping** — verify the app is alive:

```bash
npm run ping
```

Expected output: `pong`

## Project Structure

```
qa-bot/
├── scripts/        # Utility and runner scripts
│   └── ping.ts     # Health-check script
├── .claude/        # Claude AI assistant settings
└── package.json
```

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Script runner**: [tsx](https://github.com/privatenumber/tsx)
