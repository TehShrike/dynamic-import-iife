import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
	name: 'dynamicImportIife',
	input: './index.js',
	sourcemap: true,
	plugins: [
		commonjs(),
		resolve({
			browser: true,
		}),
		babel({
			exclude: 'node_modules/**',
			babelrc: false,
			presets: [
				[
					'es2015',
					{
						modules: false,
					},
				],
			],
			plugins: [
				'external-helpers',
			],
		}),
	],
	output: [
		{ file: pkg.main, format: 'umd' },
		{ file: pkg.browser, format: 'cjs' },
	],
}
