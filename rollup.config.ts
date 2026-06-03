import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json' with { type: 'json' };

const BANNER = `/**
 *
 * @author ${pkg.author}
 * @version ${pkg.version}
 * @license ${pkg.license}
 */`;

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/umbra.esm.js',
        format: 'esm',
        banner: BANNER,
      },
      {
        file: 'dist/umbra.umd.js',
        name: 'Umbra',
        format: 'umd',
        banner: BANNER,
        plugins: [terser()],
      },
    ],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      cleanup({ comments: 'none', extensions: ['ts'] }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umbra.d.ts',
      format: 'esm',
    },
    plugins: [dts({ tsconfig: './tsconfig.json' })],
  },
];

export default config;
