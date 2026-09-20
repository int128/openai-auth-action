import * as core from '@actions/core'
import { run } from './run.js'

try {
  await run({
    audience: core.getInput('audience', { required: true }),
    identityProviderId: core.getInput('identity-provider-id', { required: true }),
    serviceAccountId: core.getInput('service-account-id', { required: true }),
  })
} catch (e) {
  core.setFailed(e instanceof Error ? e : String(e))
  console.error(e)
}
