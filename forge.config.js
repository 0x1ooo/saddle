module.exports = {
  packagerConfig: {},
  makers: [{
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "saddle"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "darwin"
      ]
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {}
    }
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [{
            html: "./assets/index.html",
            js: "./src/renderer/renderer.tsx",
            name: "main_window"
          }]
        },
        port: 9876,
        loggerPort: 9877
      }
    ]
  ]
}