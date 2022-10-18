import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

function config({ minify, input, name, outputName, ext = 'js' }) {
	const dir = `dist/umd`;
	const minifierSuffix = minify ? '.min' : '';
	return {
		input: `./src/${input}.ts`,
		output: {
			name: outputName,
			file: `${dir}/${input}${minifierSuffix}.${ext}`,
			format: 'umd',
			sourcemap: true,
		},
		plugins: [
			commonjs(),
			nodeResolve(),
			typescript({
				clean: true,
				typescript: require('typescript'),
				tsconfig: `tsconfig.prod.${name}.json`,
			}),
			minify
				? terser({
						compress: true,
						mangle: true,
				  })
				: undefined,
		].filter(Boolean),
	};
}

export default [
	{ input: 'index', name: 'umd', outputName: 'JsonNode', minify: false },
	{ input: 'index', name: 'umd', outputName: 'JsonNode', minify: true },
	{ input: 'parseXML', name: 'umd', outputName: 'parseXML', minify: false },
	{ input: 'parseXML', name: 'umd', outputName: 'parseXML', minify: true },
].map(config);
