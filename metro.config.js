// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Enable CSS on web (RNW)
  isCSSEnabled: true,
});

/**
 * Force Metro's package "exports" condition resolution order.
 * - "browser": prefer web-friendly builds if provided
 * - "require": prefer CJS over ESM to avoid `import.meta` in some packages
 * - "react-native": still allow RN-specific entry points when available
 *
 * NOTE: This is intentionally conservative for SDK 53 / RN 0.79.
 * If you later upgrade and want more ESM, try putting "import" before "require".
 */
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

// Let NativeWind transform Tailwind classes and load ./global.css
module.exports = withNativeWind(config, { input: "./global.css" });
