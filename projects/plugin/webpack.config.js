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
    uniqueName: "plugin_amcharts5",
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

      name: "plugin_amcharts5",
      filename: "remoteEntry.js",
      exposes: {
        './JsonChartModule': './projects/plugin/src/app/json-chart.module.ts',
        './JsonChartRender': './projects/plugin/src/app/json-chart-render.component.ts',
        './JsonChartEditor': './projects/plugin/src/app/json-chart-editor.component.ts',
      },

      shared: share({

        "@angular/platform-browser": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/platform-browser/animations": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

        "@angular/cdk": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: true },
        "@angular/material": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: true },

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
