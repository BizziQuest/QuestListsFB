<template>
    <v-navigation-drawer
      :bottom="isMobile"
      :floating="isMobile"
      :expand-on-hover="!isMobile && !$vuetify.breakpoint.lgAndUp"
      :app="!isMobile"
      :permanent="!isMobile"
      v-model="showDrawer"
      :fixed="isMobile"
      :dark="!isDark"
      :light="isDark"
      test-navigation-drawer
      >
      <v-list dense nav>
        <user-menu-item :dark="!isDark" :light="isDark"/>

        <v-list-item test-questlists-link link :color="menuHighlightColor" title="View All QuestLists" to="/">
          <v-list-item-action>
            <v-icon>mdi-shield-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>QuestLists</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <CreateAList
          test-create-list
          :dark="!isDark"
          :light="isDark"
          :showDialog="showCreateList"
          :highlightColor="menuHighlightColor"
        />

        <v-list-item test-search-link link title="Look for a particular quest" to="/search">
          <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Search</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item test-fav-header>
            <v-divider class="my-4"></v-divider>
            <v-subheader>Favorite Quests</v-subheader>
        </v-list-item>

        <v-list-item test-fav-link v-for="item in favoriteQuests"
        :key="item.id" link :title="item.name" :to="`/lists/${item.id}`">
          <v-list-item-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{item.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
            <v-divider class="my-4"></v-divider>
            <v-subheader></v-subheader>
        </v-list-item>

        <v-list-item test-dark-mode-switch link @click="isDark = !isDark">
          <v-list-item-action>
            <v-icon>{{isDark ? 'mdi-brightness-4' : 'mdi-brightness-7'}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Turn Dark Mode {{isDark ? 'Off' : 'On'}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link title="About QuestLists" to="/about">
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About QuestLists</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
</template>

<script>
import CreateAList from '../CreateAList.vue';
import { auth } from '../../firebase';
import UserMenuItem from './UserMenuItem.vue';

export default {
  name: 'DrawerMenu',
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },
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
