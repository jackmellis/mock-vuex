module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "babel",
  ],
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  "parserOptions": {
    "sourceType": "module",
  },
  "rules": {
      "indent": [ "error", 2 ],
      "linebreak-style": [ "error", "unix" ],
      "quotes": [ "error", "single" ],
      "semi": [ "error", "always" ],
      "arrow-parens": 0,
      "comma-dangle": [ "error", "always-multiline" ],
      "curly": [ "error", "all" ],
      "no-invalid-this": "error",
      "no-param-reassign": [ "error", { "props": true } ],
      "array-bracket-spacing": [ "error", "always" ],
      "comma-dangle": [ "error", "always-multiline" ],
      "max-len": [ "error", {
        "code": 80,
        "ignoreComments": true,
        "ignoreTemplateLiterals": true,
      } ],
      "@typescript-eslint/no-unused-vars": "error",
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [ ".ts", ".js" ],
      },
    },
  },
};
