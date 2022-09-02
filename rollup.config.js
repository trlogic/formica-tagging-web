import typescript from '@rollup/plugin-typescript';

export default {
 input: 'src/index.ts',
 output: [
  {
   file: 'dist/index.esm.js',
   format: 'es',
  },
  {
   file: 'dist/index.umd.js',
   format: 'umd',
   name: 'umd',
  },
  {
   file: "dist/index.amd.js",
   format: "amd",
   name: "amd"
  },
  {
   file: 'dist/index.js',
   format: 'iife',
   name: "FormicaTracker",
   exports: "default"
  },
  {
   file: `dist/bundle.js`,
   format: 'cjs',
   sourcemap: true
  },
 ],
 plugins: [typescript()],
};
