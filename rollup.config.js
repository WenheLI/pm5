import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

module.exports = {
    input: 'index.ts',
    plugins: [
        json(),
        typescript({
            tsconfigOverride: {compilerOptions: {module: 'ES2015'}},
            tsconfig: "tsconfig.json"
        }),   
    ],
    output: {
      file: 'dist/index.js',
      format: 'es'
    }
  };