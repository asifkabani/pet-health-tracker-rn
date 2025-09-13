const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default configuration
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Manually set resolver conditions to prioritize CommonJS for web.
// This is the key fix for the 'import.meta' error.
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

// Wrap the modified config with withNativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
