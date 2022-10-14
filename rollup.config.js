import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { relative, parse } from 'path';

function config({ minify, input, name, ext = 'js' }) {
	const dir = `build/${name}`;
	const minifierSuffix = minify ? '.min' : '';
	return {
		input: `./src/${input}.ts`,
		output: {
			dir,
			format: 'esm',
			entryFileNames: `[name]${minifierSuffix}.${ext}`,
			chunkFileNames: `[name]${minifierSuffix}.${ext}`,
			minifyInternalExports: false,
			manualChunks: (id) => {
				const rel = relative('./src', id);
				const { dir, name } = parse(rel);

				if (dir.includes('..') || dir.includes('node_modules')) return;
				if (dir.startsWith('node')) return 'node/' + name;
				if (dir === '') return name;
			},
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
	{ input: 'index', name: 'esm2015', minify: false },
	{ input: 'index', name: 'esm2015', minify: true },
	{ input: 'index', name: 'esm5', minify: false },
	{ input: 'index', name: 'esm5', minify: true },
].map(config);
