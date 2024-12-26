"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = void 0;
var util_1 = require("util");
var passport_oauth2_1 = __importDefault(require("passport-oauth2"));
var DEFAULT_CLIENT_SECRET = 'lawyersone';
var buildOptions = function (options) {
    options.authorizationURL = "".concat(options.oauthHost, "/api/oauth/authorize");
    options.tokenURL = "".concat(options.oauthHost, "/api/oauth/token");
    options.customHeaders = options.customHeaders || {};
    if (!options.clientSecret) {
        options.clientSecret = DEFAULT_CLIENT_SECRET;
    }
    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] =
            options.userAgent || 'passport-lawyersone';
    }
    return options;
};
exports.buildOptions = buildOptions;
/**
 * LawyersOneStrategy 생성자 함수.<br/>
 * @param options.clientID 필수. lawyers one rest app key.
 * @param options.clientSecret 필수. lawyers one rest app secret key.
 * @param options.callbackURL 필수. 로그인 처리 후 호출할 URL
 * @param options.environment 필수. 'development' or 'production'
 * @param verify
 * @constructor
 */
function Strategy(options, verify) {
    if (options === void 0) { options = {}; }
    console.log('init options : ', options);
    options.oauthHost =
        options.environment === 'production'
            ? 'https://lawyersone.co.kr'
            : 'https://lawyersone-api.lawbot.io';
    passport_oauth2_1.default.call(this, (0, exports.buildOptions)(options), verify);
    this.name = 'lawyersone';
    console.log('this : ', this);
    this._userProfileURL = "".concat(options.oauthHost, "/api/external/users/me");
}
/**
 * `OAuth2Stragegy`를 상속 받는다.
 */
(0, util_1.inherits)(Strategy, passport_oauth2_1.default);
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
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.useAuthorizationHeaderforGET(true);
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body) {
        if (err) {
            return done(err);
        }
        try {
            var json = JSON.parse(body);
            var profile = { provider: 'lawyersone' };
            profile.id = json.id;
            profile.name = json.name;
            profile.username = json.username;
            profile.email = json.email;
            profile.phone = json.phone;
            profile.role = json.role;
            profile.birth = json.birth;
            profile.createdAt = json.createdAt;
            profile._raw = body;
            profile._json = {
                id: json.id,
                name: json.name,
                username: json.username,
                email: json.email,
                phone: json.phone,
                role: json.role,
                birth: json.birth,
                createdAt: json.createdAt,
            };
            return done(null, profile);
        }
        catch (e) {
            console.log('error : ', e);
            return done(e);
        }
    });
};
exports.default = Strategy;
