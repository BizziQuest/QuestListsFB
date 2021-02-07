module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  configureWebpack: {
    devtool: 'source-map'
  },

  devServer: {
    disableHostCheck: true,
  },

  pwa: {
    name: 'Questlists',
    themeColor: '#ab47bc',
    msTileColor: '#ab47bc',
    manifestOptions: {
      background_color: '#fff176',
    },
  },
};
