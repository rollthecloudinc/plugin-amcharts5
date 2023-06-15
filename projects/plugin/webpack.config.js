const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  []);

module.exports = {
  output: {
    uniqueName: "plugin",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      
      library: { type: "module" },

      name: "plugin",
      filename: "remoteEntry.js",
      exposes: {
        './DownloadModule': './projects/plugin/src/app/download.module.ts',
        './Download': './projects/plugin/src/app/download.component.ts',
        './Upload': './projects/plugin/src/app/upload.component.ts'
      },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

        "@rollthecloudinc/utils": { singleton: true, strictVersion: true, requiredVersion: 'auto', eager: false },
        "@rollthecloudinc/attributes": { singleton: true, strictVersion: true, requiredVersion: 'auto', eager: false },
        "@rollthecloudinc/plugin": { singleton: true, strictVersion: true, requiredVersion: 'auto', eager: false },
        "@rollthecloudinc/material": { singleton: true, strictVersion: true, requiredVersion: 'auto', eager: false },
        "@rollthecloudinc/content": { singleton: true, strictVersion: true, requiredVersion: 'auto', eager: false },

        ...sharedMappings.getDescriptors()
      })

    }),
    sharedMappings.getPlugin()
  ],
};
