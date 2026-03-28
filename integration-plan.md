# Unified AI Usage Dashboard — Integration Plan

## Decision
Do not build a new dashboard from scratch.
Use `openusage` as the base and extend it to cover the exact usage sources needed:
- Claude.ai
- Claude API
- OpenAI consumer usage
- OpenAI API

## Why this repo
`openusage` is already close enough because it:
- tracks Claude-related usage
- tracks OpenAI/API platform data
- has a live dashboard + daemon architecture
- already supports provider detection, cost estimates, and quota monitoring

## Gaps to close
The likely missing pieces are:
- true Claude.ai consumer-account ingestion
- true OpenAI consumer-account ingestion
- a dashboard view that separates consumer vs API usage cleanly
- any custom auth/account-linking needed for those consumer plans

## Suggested implementation approach
1. Fork `openusage`.
2. Keep the existing provider detection and telemetry pipeline.
3. Add source adapters for:
   - Claude.ai consumer
   - Claude API
   - OpenAI consumer
   - OpenAI API
4. Normalize all records into a shared schema:
   - provider
   - account type
   - date/time
   - model
   - tokens in/out
   - requests
   - cost
   - quota window
5. Update the UI to show:
   - total spend
   - provider breakdown
   - consumer vs API split
   - daily / weekly / monthly trends
   - threshold alerts

## Recommended product shape
- local-first dashboard
- optional background daemon
- one config file
- minimal manual setup
- exportable data

## Next action
When asked to continue, inspect `openusage` in more detail and map the exact files/modules that would need changes.
