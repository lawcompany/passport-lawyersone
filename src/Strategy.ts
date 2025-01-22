import { inherits } from 'util'
import OAuth2Strategy from 'passport-oauth2'

import { StrategyOptions, Profile } from './interfaces'

const DEFAULT_CLIENT_SECRET = 'lawyersone'

export const buildOptions = (options: StrategyOptions) => {
  options.authorizationURL = `${options.oauthHost}/api/oauth/authorize`
  options.tokenURL = `${options.oauthHost}/api/oauth/token`
  options.customHeaders = options.customHeaders || {}

  if (!options.clientSecret) {
    options.clientSecret = DEFAULT_CLIENT_SECRET
  }

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] =
      options.userAgent || 'passport-lawyersone'
  }

  return options
}
/**
 * LawyersOneStrategy 생성자 함수.<br/>
 * @param options.clientID 필수. lawyers one rest app key.
 * @param options.clientSecret 필수. lawyers one rest app secret key.
 * @param options.callbackURL 필수. 로그인 처리 후 호출할 URL
 * @param options.environment 필수. 'development' or 'production'
 * @param verify
 * @constructor
 */
function Strategy(options: StrategyOptions = {}, verify: any) {
  options.oauthHost =
    options.environment === 'production'
      ? 'https://lawyersone.co.kr'
      : options.environment === 'local'
      ? 'http://localhost:3030'
      : 'https://lawyersone-api.lawbot.io'
  OAuth2Strategy.call(this, buildOptions(options), verify)
  this.name = 'lawyersone'
  this._userProfileURL = `${options.oauthHost}/api/external/users/me`
  this._state = options.state || true
}

/**
 * `OAuth2Stragegy`를 상속 받는다.
 */
inherits(Strategy, OAuth2Strategy)

/**
 * 사용자 정보를 얻는다.<br/>
 * 사용자 정보를 성공적으로 조회하면 아래의 object가 done 콜백함수 호출과 함꼐 넘어간다.
 *
 *   - `provider`         lawyersone 고정
 *   - `id`               lawyersone user id number
 *   - `username`         사용자의 lawyersone username
 *   _ `_json`            json 원 데이터
 *
 * @param {String} accessToken
 * @param {String} refreshToken
 * @param {Function} done
 */
Strategy.prototype.userProfile = function (
  accessToken: string,
  done: (error: Error, profile?: Profile) => void
) {
  this._oauth2.useAuthorizationHeaderforGET(true)
  this._oauth2.get(
    this._userProfileURL,
    accessToken,
    (err: Error, body: string) => {
      if (err) {
        return done(err)
      }

      try {
        const json = JSON.parse(body) as Record<string, any>
        return done(null, {
          ...json,
          provider: 'lawyersone',
          raw: body,
          _json: json,
        })
      } catch (e) {
        console.log('error : ', e)
        return done(e)
      }
    }
  )
}

export default Strategy
