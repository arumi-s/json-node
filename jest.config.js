module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
	},
};
