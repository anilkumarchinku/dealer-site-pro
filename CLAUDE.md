# Dealer Site Pro — Claude Instructions

## Obsidian Knowledge Base
Full project docs live in Obsidian. Use the `obsidian-vault` MCP tool.
Before starting any task, read the relevant doc:
- Overview: `dealer-site-pro/Project Overview.md`
- Architecture: `dealer-site-pro/Architecture.md`
- Gotchas: `dealer-site-pro/Gotchas.md`
- Design System: `dealer-site-pro/Design System.md`
- Patterns: `dealer-site-pro/Patterns.md`

## Stack
Next.js + Supabase + Zustand + Tailwind CSS + TypeScript

## Quick Commands
```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Rules
- Zustand for client state, Supabase for server/auth state — don't mix them
- This project path has a space — always quote it in shell: `"dealersite pro"`
- Server components can't use hooks — check before adding client-side code
- When you find a bug or edge case → write to `dealer-site-pro/Gotchas.md`
- When you make a pattern decision → write to `dealer-site-pro/Patterns.md`
