import docusign from 'docusign-esign'

let cachedToken = null
let tokenExpiresAt = 0

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const missing = ['DOCUSIGN_PRIVATE_KEY', 'DOCUSIGN_INTEGRATION_KEY', 'DOCUSIGN_USER_ID', 'DOCUSIGN_OAUTH_BASE_PATH', 'DOCUSIGN_BASE_PATH', 'DOCUSIGN_ACCOUNT_ID', 'DOCUSIGN_TEMPLATE_ID'].filter(k => !process.env[k])
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`)

  const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY, 'base64').toString('utf8')
  const apiClient = new docusign.ApiClient()
  apiClient.setOAuthBasePath(process.env.DOCUSIGN_OAUTH_BASE_PATH)

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    ['signature', 'impersonation'],
    privateKey,
    3600
  )

  cachedToken = results.body.access_token
  tokenExpiresAt = Date.now() + 55 * 60 * 1000 // refresh 5 min before expiry
  return cachedToken
}

export async function getApiClient() {
  const accessToken = await getAccessToken()
  const apiClient = new docusign.ApiClient()
  apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH)
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)
  return apiClient
}
