<template>
  <v-app
    id="app"
    @keyup.ctrl.f="handleFind"
  >
    <drawer-menu v-model:drawer="drawer" />
    <v-main style="max-width: 100%;" :style="`${pageBackgroundColor};${pageForegroundColor};`">
      <router-view v-slot="{ Component }">
        <transition name="router-anim" >
              <component :is="Component"/>
            </transition>
          </router-view>
      </v-main>
    <bottom-drawer-menu v-model:drawer="drawer" />
    <notification />
    <v-snackbar
      test-update-notification
      bottom
      :value="updateExists"
      :timeout="-1"
      color="primary"
    >
      An update is available
      <v-btn
        text
        @click="refreshApp"
      >
        Update
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import DrawerMenu from './components/Menus/DrawerMenu.vue';
import BottomDrawerMenu from './components/Menus/BottomDrawerMenu.vue';
import Notification from './components/GlobalNotification.vue';
import appUpdate from './mixins/appUpdate';

import Logo from './assets/logo.png';
const siteData = {
  name: 'QuestLists',
  description: 'QuestLists is a simple app to keep track of your quests in your favorite games.',
  author: 'QuestLists',
  image: Logo,
  imageAlt: 'QuestLists Logo',
}

export default {
  name: 'QuestLists App',
  components: {
    DrawerMenu,
    BottomDrawerMenu,
    Notification,
  },
  mixins: [appUpdate],
  data() {
    return {
      drawer: true,
      mainTheme: 'light',
    };
  },
  computed: {
    ...mapState({
      pageBackgroundColor(state) {
        if (state.pageBackgroundColor)
          return `background-color: ${state.pageBackgroundColor}`
        return '';
      },
      pageForegroundColor(state) {
        this.mainTheme = state.pageForegroundColor !== 'white' ? 'light' : 'dark';
        return `color: ${state.pageForegroundColor}`;
      }
    }),
  },
  mounted() {
    this.$watch('$vuetify.display.name', (from, to) => {
      if (from !== 'sm' && to === 'sm') {
        this.drawer = false;
      }
    });
  },
  methods: {
    handleFind() {
      console.warn('Search Not Implemented');
    },
  },
  head: {
    title: 'QuestLists',
    description: 'QuestLists is a simple app to keep track of your quests in your favorite games.',
    author: 'QuestLists',
    // Meta tags
    meta: [
      { name: 'application-name', content: siteData.name },
      { name: 'description', content: siteData.description, id: 'desc' },
      { name: 'author', content: siteData.author },

      // Twitter
      { name: 'twitter:title', content: siteData.name },
      { name: 'twitter:description', c: siteData.description},
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: `@${siteData.author}` },
      { name: 'twitter:creator', content: `@${siteData.author}` },
      { name: 'twitter:image', content: siteData.image },
      { name: 'twitter:image:alt', content: siteData.imageAlt },

      // Google+ / Schema.org: https://schema.org/WebApplication
      { itemprop: 'name', content: siteData.name },
      { itemprop: 'description', content: siteData.description },
      { itemprop: 'browserRequirements', content: 'requires evergreen browsers' },
      { itemprop: 'applicationCategory', content: 'Lists' },

      // Facebook / Open Graph
      { property: 'fb:app_id', content: '123456789' },
      { property: 'og:title', content: siteData.name },
      { p: 'og:image', c: siteData.image },
      { p: 'og:description', c: siteData.description },
      { p: 'og:url', c: 'https://questlists.firebaseapp.com/' },
      { p: 'og:site_name', c: siteData.name },
      { p: 'og:type', c: 'website' },
      { p: 'og:locale', c: 'en_US' },
      { p: 'og:image:alt', c: siteData.imageAlt },
    ],
    // link tags
    link: [
      { rel: 'canonical', href: 'https://questlists.firebaseapp.com/', id: 'canonical' },
      { rel: 'author', href: 'mailto:questlists@rbe.homeip.net', undo: false }, // undo property - not to remove the element
      { rel: 'icon', href: './path/to/icon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    script: [
      // { type: 'text/javascript', src: 'cdn/to/script.js', async: true, body: true}, // Insert in body
      { t: 'application/ld+json', i: '{ "@context": "http://schema.org" }' },
    ],
  }
};
</script>

<style>
/*.theme--dark.v-application {
    background: #81b98b;
    color: #FFFFFF;
}*/
.firebase-emulator-warning {
  display: none;
}

.router-anim-enter-active {
  transition: all 0.8s ease;
}
.router-anim-leave-active {
  transition: all 0.3s cubic-bezier(0.3, 0.5, 0.8, 1);
}
.router-anim-enter,
.router-anim-leave-to {
  position: absolute;
  top: 0px;
  transform: translateX(15px);
  opacity: 0;
}
</style>
