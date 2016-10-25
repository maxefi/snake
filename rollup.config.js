import typescript from 'rollup-plugin-typescript';

export default {
    entry: './index.ts',
    dest: './index.js',
    format: 'iife',
    sourceMap: 'inline',

    plugins: [
        typescript()
    ]
};
