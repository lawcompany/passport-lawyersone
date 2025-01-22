export interface StrategyOptions {
  authorizationURL?: string
  tokenURL?: string
  clientSecret?: string
  scopeSeparator?: string
  environment?: string // 'development' or 'production'
  oauthHost?: string
  customHeaders?: {
    'User-Agent'?: string
  }
  userAgent?: string
  state?: boolean
}

export interface Profile {}
