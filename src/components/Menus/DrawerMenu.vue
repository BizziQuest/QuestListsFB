<template>
  <v-navigation-drawer
    v-model="showDrawer"
    :bottom="isMobile"
    :floating="isMobile"
    :expand-on-hover="!isMobile && !$vuetify.breakpoint.lgAndUp"
    :app="!isMobile"
    :permanent="!isMobile"
    :fixed="isMobile"
    :dark="!isDark"
    :light="isDark"
    test-navigation-drawer
  >
    <v-list
      dense
      nav
    >
      <user-menu-item
        :dark="!isDark"
        :light="isDark"
      />
      <v-list-item
        test-questlists-link
        link
        :color="menuHighlightColor"
        title="View All QuestLists"
        to="/"
      >
        <v-list-item-action style="margin-right: 15px;">
          <v-icon>ql-0</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title style="margin-left: 0px;">
            QuestLists
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        test-default-create-list-item
        to="/new"
        link
        :color="menuHighlightColor"
        title="Create A New Quest"
      >
        <v-list-item-action style="margin-right: 15px;">
          <v-icon>ql-plus</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>New Quest</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item test-fav-header>
        <v-divider class="my-4" />
        <v-subheader>Recent Quests</v-subheader>
      </v-list-item>

      <v-list-item
        v-for="item in recentQuests"
        :key="`${item.slug}${item.title}`"
        test-fav-link
        link
        :title="item.title"
        :to="item.slug ? `/lists/${item.slug}` : ''"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon || '$questlists' }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-divider class="my-4" />
        <v-subheader />
      </v-list-item>

      <v-list-item
        test-dark-mode-switch
        link
        @click="isDark = !isDark"
      >
        <v-list-item-action>
          <v-icon>{{ isDark ? 'mdi-brightness-4' : 'mdi-brightness-7' }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Turn Dark Mode {{ isDark ? 'Off' : 'On' }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        link
        title="About QuestLists"
        to="/about"
      >
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
import { mapState, mapActions } from 'vuex';
import { auth } from '../../firebase';
import UserMenuItem from './UserMenuItem.vue';

export default {
  name: 'DrawerMenu',
  components: {
    // CreateList,
    UserMenuItem,
  },
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
  data() {
    return {
      currentTheme: this.$vuetify.theme,
      showCreateList: false,
      auth,
    };
  },
  mounted() {
    this.getRecentlyUsedQuests(this.currentUser);
  },
  methods: {
    ...mapActions(['getRecentlyUsedQuests']),
  },
  watch: {
    currentUser(_oldUser, newUser) {
      this.getRecentlyUsedQuests(newUser);
    },
  },
  computed: {
    ...mapState(['currentUser', 'recentQuests']),
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
