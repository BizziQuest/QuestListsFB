<template>
  <v-navigation-drawer
    v-model="showDrawer"
    :bottom="isMobile"
    :floating="isMobile"
    :expand-on-hover="!isMobile && !$vuetify.display.lgAndUp"
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
      <v-divider/>
      <v-list-item
        test-questlists-link
        link
        :color="menuHighlightColor"
        to="/"
      >
        <template v-slot:prepend>
          <v-icon icon="$questlists"/>
        </template>
        <v-list-item-title v-text="'QuestLists'" class="ml-4"/>
      </v-list-item>

      <v-list-item
        test-default-create-list-item
        to="/new"
        link
        :color="menuHighlightColor"
      >
        <template v-slot:prepend>
          <v-icon icon="$questlists-plus"/>
        </template>
        <v-list-item-title v-text="'New Quest'" class="ml-4"/>
      </v-list-item>

      <v-list-item test-fav-header>
        <v-divider class="my-4" />
        <v-list-subheader>Recent Quests</v-list-subheader>
      </v-list-item>

      <v-list-item
        v-for="item in recentQuests"
        :key="`${item.slug}${item.title}`"
        test-fav-link
        link
          :to="item.slug ? `/lists/${item.slug}` : ''"
      >
      <template v-slot:prepend>
          <v-icon>{{ item.icon || '$questlists' }}</v-icon>
        </template>
        <v-list-item-title v-text="item.title" class="ml-4"/>
      </v-list-item>

      <v-list-item>
        <v-divider class="my-4" />
        <v-list-subheader />
      </v-list-item>

      <v-list-item
        test-dark-mode-switch
        link
        @click="isDark = !isDark"
      >
        <template v-slot:prepend>
          <v-icon>{{ isDark ? 'mdi-brightness-4' : 'mdi-brightness-7' }}</v-icon>
        </template>
        <v-list-item-title class="ml-4">Turn Dark Mode {{ isDark ? 'Off' : 'On' }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        link
        to="/about"
      >
        <template v-slot:prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        <v-list-item-title class="ml-4">About QuestLists</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { auth } from '../../firebase';
import UserMenuItem from './UserMenuItem.vue';
import { useTheme } from 'vuetify';

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
      showCreateList: false,
      auth,
      theme: useTheme(),
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
      return this.$vuetify.display.xs;
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
        return this.theme.global.current.dark;
      },
      set(val) {
        this.theme.global.name = this.theme.global.current.dark ? 'light' : 'dark'
        // this.$vuetify.theme.dark = val;
      },
    },
  },
};
</script>
<style scoped lang="scss">
.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  &:not([color]) {
    // color: #ffffff !important;

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
