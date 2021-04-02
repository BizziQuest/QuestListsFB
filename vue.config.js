module.exports = {
  transpileDependencies: [
    'vuetify',
  ],

  configureWebpack: {
    devtool: 'source-map',
  },

  devServer: {
    disableHostCheck: true,
  },

  pwa: {
    name: 'QuestLists',
    title: 'QuestLists',
    themeColor: '#f9aa33',
    msTileColor: '#f9aa33',
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png',
    },
    icons: [
      {
        src: './img/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './img/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    manifestOptions: {
      background_color: '#363636',
      icons: [
        {
          src: 'img/logo/shield-check-outline-72x72.png',
          sizes: '72x72',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-128x128.png',
          sizes: '128x128',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        }, {
          src: 'img/logo/shield-check-outline-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
