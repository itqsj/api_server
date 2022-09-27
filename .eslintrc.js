module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    // "rules": {
    // 	"indent": [
    // 		"error",
    // 		"tab"
    // 	],
    // 	"linebreak-style": [
    // 		"error",
    // 		"windows"
    // 	],
    // 	"quotes": [
    // 		"error",
    // 		"double"
    // 	],
    // 	"semi": [
    // 		"error",
    // 		"always"
    // 	]
    // }
};
