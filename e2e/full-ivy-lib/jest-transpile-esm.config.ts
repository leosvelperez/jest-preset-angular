import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    displayName: 'e2e-full-ivy-lib',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/../setup-test-env.mts'],
    moduleNameMapper: {
        rxjs: '<rootDir>/../../node_modules/rxjs/dist/bundles/rxjs.umd.js',
    },
    extensionsToTreatAsEsm: ['.ts', '.mts'],
    transform: {
        '^.+\\.(ts|mts|mjs|js|html)$': [
            '<rootDir>/../../build/index.js',
            {
                useESM: true,
                tsconfig: '<rootDir>/tsconfig-transpile-esm.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
    },
};

export default config;
