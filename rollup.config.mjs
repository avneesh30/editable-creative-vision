import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pkg from './package.json' assert { type: 'json' };

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'esm',
            exports: 'named',
            sourcemap: true,
        }
    ],
    plugins: [
        external(),
        url({
            include: ['**/*.svg'],
            limit: 0,
            fileName: '[name][extname]',
            destDir: 'dist/assets'
        }),
        postcss({
            config: {
                path: './postcss.config.cjs',
            },
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
        }),
        typescript({
            tsconfig: './tsconfig.json',
            clean: true,
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        resolve(),
        commonjs(),
        terser(),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
};