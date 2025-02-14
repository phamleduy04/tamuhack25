module.exports = {
  configureWebpack: {
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  },
  transpileDependencies: ["vuetify"],
  devServer: {
    disableHostCheck: true
  }
};
