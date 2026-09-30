import assert from 'node:assert'
import * as core from '@actions/core'

type Inputs = {
  audience: string
  identityProviderId: string
  serviceAccountId: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  core.info(`Fetching an ID token from GitHub Actions`)
  const actionsToken = await core.getIDToken(inputs.audience)

  const tokenRequestPayload = createTokenRequestPayload({
    actionsToken,
    identityProviderId: inputs.identityProviderId,
    serviceAccountId: inputs.serviceAccountId,
  })
  const tokenRequest = new Request('https://auth.openai.com/oauth/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(tokenRequestPayload),
  })

  core.info(`Fetching an access token from OpenAI`)
  const tokenResponse = await fetch(tokenRequest)
  if (!tokenResponse.ok) {
    throw new Error(`OpenAI returned an error response: ${tokenResponse.status}: ${await tokenResponse.text()}`)
  }

  const tokenResponsePayload = await tokenResponse.json()
  assetTokenResponsePayload(tokenResponsePayload)
  core.info(`Got an access token (expires at ${new Date(tokenResponsePayload.expires_at * 1000).toISOString()})`)

  const openaiToken: string = tokenResponsePayload.access_token
  core.setSecret(openaiToken)
  core.setOutput('token', openaiToken)
}

// https://developers.openai.com/api/reference/workload-identity-federation#response
type TokenResponsePayload = {
  access_token: string
  expires_at: number
}

function assetTokenResponsePayload(x: unknown): asserts x is TokenResponsePayload {
  assert(typeof x === 'object', `token response must be an object but was ${typeof x}`)
  assert(x != null, 'token response must not be null')
  assert('access_token' in x, 'token response must contain access_token field')
  assert(typeof x.access_token === 'string', 'access_token must be a string')
  assert('expires_at' in x, 'token response must contain expires_at field')
  assert(typeof x.expires_at === 'number', 'expires_at must be a number')
}

const createTokenRequestPayload = (inputs: {
  actionsToken: string
  identityProviderId: string
  serviceAccountId: string
}) => ({
  grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
  subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
  subject_token: inputs.actionsToken,
  identity_provider_id: inputs.identityProviderId,
  service_account_id: inputs.serviceAccountId,
})
