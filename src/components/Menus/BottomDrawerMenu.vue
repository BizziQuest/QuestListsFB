<template>
    <v-bottom-navigation
      absolute
      app
      :input-value="isMobile"
      hide-on-scroll
      :dark="!isDark"
      :light="isDark"
      >
        <v-btn
          :color="menuHighlightColor"
          icon
          title="View App Menu"
          to="/"
          @click="$emit('update:drawer', !drawer)"
        >
          <v-icon>mdi-shield-check-outline</v-icon>
        </v-btn>
        <user-menu-item :dark="!isDark" :light="isDark"/>
        <CreateAList
          :dark="!isDark"
          :light="isDark"
          :showDialog="showCreateList"
          :highlightColor="menuHighlightColor"
          fab/>
    </v-bottom-navigation>
</template>

<script>
import CreateAList from '../CreateAList.vue';
import { auth } from '../../firebase';
import UserMenuItem from './UserMenuItem.vue';

export default {
  name: 'BottomDrawerMenu',
  props: ['drawer'],
  components: {
    CreateAList,
    UserMenuItem,
  },
  data() {
    return {
      currentTheme: this.$vuetify.theme,
      showCreateList: false,
      auth,
      favoriteQuests: [
        {
          name: 'Sample Favorite Quest with amazingly long title and now that\'s about it',
          icon: 'mdi-heart',
          id: 0,
        },
      ],
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs;
    },
    menuHighlightColor() {
      return this.isDark ? 'primary' : 'secondary';
    },
    avatar() {
      return this.$store.state.currentUser?.avatar;
    },
    showDrawer: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.$emit('update:drawer', val);
      },
    },
    isNavDark() {
      return !this.isDark;
    },
    isDark: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set(val) {
        this.$vuetify.theme.dark = val;
      },
    },
  },
};
</script>
<style scoped lang="scss">
.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  &:not([color]) {
    color: #ffffff !important;
    &.theme--light {
      color: #ffffff !important;
      .v-icon {
        color: #ffffff;
      }
    }
  }
  &.theme--dark {
    color: #ffffff !important;
    .secondary--text {
      color: var(--v-secondary-base) !important;
    }
    .v-icon {
      color: #ffffff;
    }
  }
}
/* /deep/ .theme--light {
  &.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled):not([color]) {
    color: #ffffff !important;
  }
  &.v-icon {
    color: #ffffff;
  }
}
/deep/ [color="secondary"] {
  &.theme--light {
    .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
      color: var(--v-secondary-base) !important;
    }
  }
  &.theme--dark {
    &.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
      color: var(--v-secondary-base) !important;
    }
  }
}

/deep/ .theme--light .secondary--text {
  font-weight: bold;
}
*/
</style>
