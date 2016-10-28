import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    entry: './index.tsx',
    dest: './index.js',
    format: 'iife',
    sourceMap: 'inline',

    plugins: [
        typescript(),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true,
            // skip: [ 'mobx', 'mobx-react' ],
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                // 'node_modules/mobx/lib/mobx.js': ['createElement', 'Component'],
                'node_modules/mobx-react/index.js': ['observer'],
                'node_modules/react/react.js': ['createElement', 'Component', 'PropTypes'],
                'node_modules/react-dom/index.js': ['render'],
                "node_modules/classnames/index.js": ['classNames'],
            }
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify( 'production' )
        })
    ]
};
