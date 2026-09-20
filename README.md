# openai-auth-action [![ts](https://github.com/int128/openai-auth-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/openai-auth-action/actions/workflows/ts.yaml)

This action acquires a short-live token with OpenAI workload identity federation.

## TL;DR

- Do not store your API key to GitHub Actions secrets.
- Use the Workload identity federation to authenticate with OpenAI.

## Getting Started

Here is an example workflow.

```yaml
jobs:
  run:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: int128/openai-auth-action@v1
        with:
          audience: https://api.openai.com
          identity-provider-id: ${{ secrets.OPENAI_IDENTITY_PROVIDER_ID }}
          service-account-id: ${{ secrets.OPENAI_SERVICE_ACCOUNT_ID }}
      - run: something-to-invoke-openai
        env:
          OPENAI_API_KEY: ${{ steps.openai.outputs.token }}
```

## Specification

### Inputs

| Name                   | Default    | Description                 |
| ---------------------- | ---------- | --------------------------- |
| `audience`             | (required) | Audience                    |
| `identity-provider-id` | (required) | OpenAI Identity Provider ID |
| `service-account-id`   | (required) | OpenAI Service account ID   |

### Outputs

| Name    | Description                    |
| ------- | ------------------------------ |
| `token` | A short-lived token for OpenAI |
