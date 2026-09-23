# openai-auth-action [![ts](https://github.com/int128/openai-auth-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/openai-auth-action/actions/workflows/ts.yaml)

This action authenticates to the OpenAI API with the workload identity federation.

It exchanges a GitHub Actions OIDC token for a short-lived OpenAI access token.
You do not need to store your long-lived API key to GitHub Actions secrets.

## Getting Started

Set up [an workload identity federation in OpenAI for GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions).

Store the workload identity provider ID and the service account ID to GitHub Actions variables or secrets.

Here is an example workflow.
You can pass a short-lived token to your application via the environment variable `OPENAI_API_KEY`.

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

| Name                   | Default    | Description                           |
| ---------------------- | ---------- | ------------------------------------- |
| `audience`             | (required) | Audience of GitHub Actions OIDC token |
| `identity-provider-id` | (required) | OpenAI workload identity provider ID  |
| `service-account-id`   | (required) | OpenAI service account ID             |

### Outputs

| Name    | Description                    |
| ------- | ------------------------------ |
| `token` | A short-lived token for OpenAI |
