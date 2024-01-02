import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
    files: ['test/**/*.test.js'],
    nodeResolve: true,
    coverage: true,
    coverageConfig: {
        report: true,
        reportDir: 'coverage',
        threshold: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
    browsers: [
        playwrightLauncher({ product: 'chromium' }),
        playwrightLauncher({ product: 'webkit' }),
        playwrightLauncher({ product: 'firefox' }),
    ],
};
