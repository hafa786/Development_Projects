module.exports = {
	collectCoverageFrom: [
		'src/**/*.*',
		'!src/_tests/**/*.*',
		'!src/utills/**/*.*',
		'!src/components/LiveChats/*.js',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	moduleDirectories: ['node_modules', 'src'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	}
};
