/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  moduleNameMapper: {
    // "units/(.*)": "<rootDir>/../../game/units/$1", // doesn't work...
    "game/(.*)": "<rootDir>/../game/$1",
  },
  verbose: true,
};
