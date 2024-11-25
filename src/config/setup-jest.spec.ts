const mockInitTestEnvironment = jest.fn();
const mockZoneJs = jest.fn();
const mockZoneJsTesting = jest.fn();
const mockGetTestBed = jest.fn(() => {
    return {
        initTestEnvironment: mockInitTestEnvironment,
    };
});
jest.mock('zone.js', () => {
    const mockedResult = mockZoneJs();

    return {
        mockedResult,
    };
});
jest.mock('zone.js/testing', () => {
    const mockedResult = mockZoneJsTesting();

    return {
        mockedResult,
    };
});
jest.mock('@angular/core/testing', () => {
    return {
        getTestBed: mockGetTestBed,
    };
});

class BrowserDynamicTestingModuleStub {}
class PlatformRefStub {}
const mockPlatformBrowserDynamicTesting = jest.fn(() => new PlatformRefStub());
jest.mock('@angular/platform-browser-dynamic/testing', () => {
    return {
        BrowserDynamicTestingModule: new BrowserDynamicTestingModuleStub(),
        platformBrowserDynamicTesting: mockPlatformBrowserDynamicTesting,
    };
});

describe('setup-jest', () => {
    const assertOnInitTestEnv = (): void => {
        expect(mockGetTestBed).toHaveBeenCalled();
        expect(mockInitTestEnvironment).toHaveBeenCalled();
        expect(mockInitTestEnvironment.mock.calls[0][0]).toBeInstanceOf(BrowserDynamicTestingModuleStub);
        expect(mockPlatformBrowserDynamicTesting).toHaveBeenCalled();
        expect(mockPlatformBrowserDynamicTesting.mock.results[0].value).toBeInstanceOf(PlatformRefStub);
    };

    beforeEach(() => {
        delete globalThis.ngJest;
        delete globalThis.TextEncoder;
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('for CJS setup-jest, test environment initialization', () => {
        test('should call getTestBed() and initTestEnvironment() with the testEnvironmentOptions passed to ngJest', async () => {
            globalThis.ngJest = {
                testEnvironmentOptions: {
                    teardown: {
                        destroyAfterEach: false,
                        rethrowErrors: true,
                    },
                    errorOnUnknownElements: true,
                    errorOnUnknownProperties: true,
                },
            };

            await import('../../setup-jest');

            expect(mockZoneJs).toHaveBeenCalled();
            expect(mockZoneJsTesting).toHaveBeenCalled();
            assertOnInitTestEnv();
            expect(mockInitTestEnvironment.mock.calls[0][2]).toEqual({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });
        });

        test('should always have TextEncoder in globalThis', async () => {
            await import('../../setup-jest');

            expect(globalThis.TextEncoder).toBeDefined();
        });

        it('should call getTestBed() and initTestEnvironment() with the testEnvironmentOptions passed as argument with setupZoneTestEnv()', async () => {
            const { setupZoneTestEnv } = await import('../../setup-env/zone/index.js');

            setupZoneTestEnv({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });

            expect(mockZoneJs).toHaveBeenCalled();
            expect(mockZoneJsTesting).toHaveBeenCalled();
            assertOnInitTestEnv();
            expect(mockInitTestEnvironment.mock.calls[0][2]).toEqual({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });
        });

        it('should always have TextEncoder in globalThis with setupZoneTestEnv()', async () => {
            const { setupZoneTestEnv } = await import('../../setup-env/zone/index.js');

            setupZoneTestEnv();

            expect(globalThis.TextEncoder).toBeDefined();
        });
    });

    describe('for ESM setup-jest, test environment initialization', () => {
        test('should call getTestBed() and initTestEnvironment() with the testEnvironmentOptions passed to ngJest', async () => {
            globalThis.ngJest = {
                testEnvironmentOptions: {
                    teardown: {
                        destroyAfterEach: false,
                        rethrowErrors: true,
                    },
                    errorOnUnknownElements: true,
                    errorOnUnknownProperties: true,
                },
            };

            await import('../../setup-jest.mjs');

            expect(mockZoneJs).toHaveBeenCalled();
            expect(mockZoneJsTesting).toHaveBeenCalled();
            assertOnInitTestEnv();
            expect(mockInitTestEnvironment.mock.calls[0][2]).toEqual({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });
        });

        test('should always have TextEncoder in globalThis', async () => {
            await import('../../setup-jest.mjs');

            expect(globalThis.TextEncoder).toBeDefined();
        });

        it('should call getTestBed() and initTestEnvironment() with the testEnvironmentOptions passed as argument with setupZoneTestEnv()', async () => {
            const { setupZoneTestEnv } = await import('../../setup-env/zone/index.mjs');

            setupZoneTestEnv({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });

            expect(mockZoneJs).toHaveBeenCalled();
            expect(mockZoneJsTesting).toHaveBeenCalled();
            assertOnInitTestEnv();
            expect(mockInitTestEnvironment.mock.calls[0][2]).toEqual({
                teardown: {
                    destroyAfterEach: false,
                    rethrowErrors: true,
                },
                errorOnUnknownElements: true,
                errorOnUnknownProperties: true,
            });
        });

        it('should always have TextEncoder in globalThis with setupZoneTestEnv()', async () => {
            const { setupZoneTestEnv } = await import('../../setup-env/zone/index.mjs');

            setupZoneTestEnv();

            expect(globalThis.TextEncoder).toBeDefined();
        });
    });
});
