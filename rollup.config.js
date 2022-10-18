import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

function config({ minify, input, name, ext = 'js' }) {
	const dir = `dist/${name}`;
	const minifierSuffix = minify ? '.min' : '';
	return {
		input: `./src/${input}.ts`,
		output: {
			file: `${dir}/${input}${minifierSuffix}.${ext}`,
			format: 'esm',
			minifyInternalExports: false,
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
	{ input: 'parse-xml/index', name: 'esm', minify: false },
	{ input: 'parse-xml/index', name: 'esm', minify: true },
	{ input: 'parse-xml/index', name: 'esm5', minify: false },
	{ input: 'parse-xml/index', name: 'esm5', minify: true },
].map(config);
