const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// A Web usa o mock e não deve incluir a biblioteca nativa do SQLite.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'expo-sqlite') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
