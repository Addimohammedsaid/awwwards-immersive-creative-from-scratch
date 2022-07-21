module.exports = {
  root: true,
  extends: ["standard"],
  globals: {
    IS_DEVELOPMENT: "readonly",
  },
  parserOptions: {
    ecmasVersion: 2020,
  },
  // remove double comma error
  "comma-dangle": ["error", "never"],
};
