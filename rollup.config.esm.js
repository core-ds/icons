import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: 'src/**/*.tsx',
    output: [
        {
            dir: 'dist/esm',
            format: 'es',
            plugins: [terser()],
        },
    ],
    plugins: [
        resolve(),
        typescript({
            allowSyntheticDefaultImports: true,
            jsx: 'react',
            target: 'es6',
            outDir: './dist/esm',
            rootDir: './src',
            removeComments: true,
            strict: true,
        }),
        multiInput(),
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
};
