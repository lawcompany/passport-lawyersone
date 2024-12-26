# passport-lawyersone

passport 빌드 하기

```
pnpm run build
```

## How to use

- passport 추가

```
const passport = require('passport')
const LawyersoneStrategy = require('passport-lawyersone').Strategy;

passport.use(
  new LawyersoneStrategy(
    {
      clientID: config.lawyersone.clientID,
      clientSecret: config.lawyersone.clientSecret,
      callbackURL: config.lawyersone.callbackURL,
      environment: config.lawyersone.environment, // development | production
    },
    (accessToken, refreshToken, profile, done) => {
      // 사용자의 정보는 profile에 들어있다.
      // User.findOrCreate((err, user) => {
      //   if (err) {
      //     return done(err);
      //   }
      //   return done(null, user);
      // });
    }
  )
);
```

- api middleware 추가

```
const passport = require('passport')

app.get(
'/api/auth/lawyersone',
passport.authenticate('lawyersone'),
(req, res) => {
    console.log('come!!! lawyersone');
}
);

app.get(
'/api/user/auth-lawyersone',
passport.authenticate('lawyersone'),
(req, res) => {
    return res.json({ user: null, info: req.user._json });
}
);
```

## profile property

| key       | value  | 비고                                           |
| --------- | ------ | ---------------------------------------------- |
| provider  | String | lawyersone 고정                                |
| id        | Number | 고유 id                                        |
| name      | String | 실명 이름                                      |
| username  | String | 아이디(nickname)                               |
| email     | String | email                                          |
| phone     | String | 전화번호                                       |
| role      | String | role LAWYER OR LAWYER_WAITING OR USER OR ADMIN |
| birth     | String | 생년월일 1990-12-31                            |
| createdAt | Date   | 회원가입 일자                                  |
| \_raw     | String | 사용자 정보 조회로 얻어진 json string          |
| \_json    | Object | 사용자 정보 조회로 얻어진 json 원본 데이터     |
