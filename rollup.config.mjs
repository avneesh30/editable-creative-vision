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
import json from '@rollup/plugin-json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pkg from './package.json' assert { type: 'json' };

export default {
    input: 'src/index.tsx',
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
        json(),
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
            extract: 'bundle.css',
            modules: false,
            use: ['sass'],
            inject: false,
            writeDefinitions: true,
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
    external: [
        ...Object.keys(pkg.peerDependencies || {}),
        'canvas',
        /node_modules/
    ],
};