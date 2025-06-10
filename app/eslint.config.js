import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import parser from '@babel/eslint-parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', '.expo/**'],
    plugins: { react, 'react-native': reactNative },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['module:metro-react-native-babel-preset'] }
      }
    },
    rules: {
      'react-native/no-unused-styles': 'warn'
    }
  }
];
