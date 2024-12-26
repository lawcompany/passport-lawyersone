import LawyersOneStrategy, { buildOptions } from '../src/Strategy'

describe('passport-lawyersone', () => {
  test('passport-lawyersone 객체가 제대로 생성이 되어 있어야 한다.', () => {
    expect(LawyersOneStrategy).not.toBeNull()
  })

  test('Strategy option의 clientSecret 값이 없을 경우 default 값이 설정되어야 한다.', () => {
    const options = buildOptions({})

    expect(options).not.toBeNull()
    expect(options.clientSecret).toBe('lawyersone')
    expect(options.customHeaders?.['User-Agent']).toBe('passport-lawyersone')
  })

  test('Strategy option의 User-Agent값이 있을 경우 customHeaders의 User-Agent가 해당 값으로 설정되어야 한다.', () => {
    const options = buildOptions({
      customHeaders: {
        'User-Agent': 'HELLO WORLD',
      },
    })

    expect(options.customHeaders?.['User-Agent']).toBe('HELLO WORLD')
  })
})
