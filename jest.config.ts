import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest', // TypeScript 파일 변환
  },
  moduleFileExtensions: ['ts', 'js'], // 지원할 확장자
  testMatch: ['**/?(*.)+(spec|test).[tj]s'], // 테스트 파일 매칭
}

export default config
