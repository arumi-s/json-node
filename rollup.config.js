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
			dir,
			format: 'esm',
			entryFileNames: `[name]${minifierSuffix}.${ext}`,
			chunkFileNames: `[name]${minifierSuffix}.${ext}`,
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
	{ input: 'parseXML', name: 'esm', minify: false },
	{ input: 'parseXML', name: 'esm', minify: true },
	{ input: 'parseXML', name: 'esm5', minify: false },
	{ input: 'parseXML', name: 'esm5', minify: true },
].map(config);
