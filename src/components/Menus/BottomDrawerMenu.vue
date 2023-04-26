<template>
  <div v-if="isMobile" :class="{xsmall: $vuetify.display.xs}">
    <v-menu transition="slide-y-reverse-transition" v-if="showRecent">
    <v-list-item
        v-for="item in recentQuests"
        :key="`${item.slug}${item.title}`"
        test-fav-link
        :prepend-icon="item.icon || '$questlists'"
        link
          :to="item.slug ? `/lists/${item.slug}` : ''"
          :title="item.title"
      >
      </v-list-item>
      </v-menu>

  <v-bottom-navigation
    fixed
    :app="isMobile"
    :input-value="isMobile"
    :dark="!isDark"
    :light="isDark"
    :class="{xsmall: $vuetify.display.xs}"
    grow
  >
    <v-btn
      :color="menuHighlightColor"
      variant="text"
      title="View App Menu"
      to="/"
    >
    <i
    style="font-size: 140%"
    class="ql questlists"
    />
    <span>QuestLists</span>
  </v-btn>
  <v-menu transition="slide-y-reverse-transition" content-class="menu-content" class="recent-menu">
      <template v-slot:activator="{ props }">
        <v-btn
          value="search"
            variant="plain"
            v-bind="props"
            :color="menuHighlightColor"
          >
          <v-icon>mdi-history</v-icon>
          <span>Recent</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="recentQuests.length < 1"
          :prepend-icon="'$questlists'"
          title="No Recent Questlists"
          style="position: relative; z-index: 2147483640;"
        ></v-list-item>
        <v-list-item
          v-for="item in recentQuests"
          :key="`${item.slug}${item.title}`"
          test-fav-link
          :prepend-icon="item.icon || '$questlists'"
          link
          :to="item.slug ? `/lists/${item.slug}` : ''"
          :title="item.title"
        >
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- <v-btn
      value="search"
      variant="plain"
      to="/search"
      :color="menuHighlightColor"
    >
    <v-icon>mdi-history</v-icon>
    <span>Recent</span>
    </v-btn> -->
    <v-btn variant="plain" :ripple="false"></v-btn>
    <v-btn
      value="about"
      variant="plain"
      to="/about"
      :color="menuHighlightColor"
    >
    <v-icon>mdi-information</v-icon>
    <span>About</span>
    </v-btn>
    <user-menu-item
      :dark="!isDark"
      :light="isDark"
      class="d-flex flex-row align-center"
    >
      <template #login="slotProps">
        <v-btn
          value="signIn"
          icon
          :color="menuHighlightColor"
          v-on="slotProps.on"
        >
        <v-icon>mdi-account-arrow-right</v-icon>
        <span>Sign In</span>
        </v-btn>
      </template>
      <template #avatar="slotProps">
        <v-btn
          value="viewProfile"
          class="d-flex flex-column text-truncate align-center"
          variant="plain"
          to="/profile"
          :color="menuHighlightColor"
        >
          <v-avatar size="24">
            <v-img
              v-if="slotProps.avatar"
              :src="slotProps.avatar"
            />
            <v-icon v-else>
              mdi-account
            </v-icon>
          </v-avatar>
          <span
            class="text-truncate"
            style="max-width:100px"
          >{{ slotProps.username }}</span>
        </v-btn>
      </template>
    </user-menu-item>
  </v-bottom-navigation>
  <v-btn
      :dark="!isDark"
      :size="$vuetify.display.smAndUp ? 'large' : 'small'"
      color="primary"
      density="comfortable"
      to="/new"
      class="rounded-circle action-btn"
    >
      <i
        style="font-size: 230%"
        class="ql ql-plus"
      />
    </v-btn>

  </div>
</template>

<script>
import { auth } from '../../firebase';
import UserMenuItem from './UserMenuItem.vue';
import { mapState } from 'vuex';

export default {
  name: 'BottomDrawerMenu',
  components: {
    UserMenuItem,
  },
  props: ['drawer'],
  data() {
    return {
      showCreateList: false,
      auth,
      favoriteQuests: [
        {
          name: 'No Recent Quests',
          icon: 'mdi-heart',
          id: 0,
        },
      ],
    };
  },
  computed: {
    ...mapState(['currentUser', 'recentQuests']),
    isMobile() {
      return this.$vuetify.display.smAndDown;
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

<style>
.menu-content {
  z-index: 999999;
}
</style>

<style scoped>
.xsmall .v-btn .v-btn__content span{
  display: none;
}
.xsmall .v-btn .v-btn__content i{
  font-size: 200%;
}
.v-bottom-navigation .v-bottom-navigation__content > .v-btn {
  min-width: 40px;
}


.recent-menu {
  z-index: 999999 !important;
}
.action-btn {
  box-shadow: rgb(var(--v-theme-background)) 0px -6px 0px,
              rgb(var(--v-theme-background)) 0px 6px 0px,
              rgb(var(--v-theme-background)) -6px 0px 0px,
              rgb(var(--v-theme-background)) 6px 0px 0px;
  z-index: 99999;
  width: 75px;
  height: 75px;
  max-width: 75px;
  bottom: calc(56px - 36px);
  left: calc(50% - 36px);
  position: absolute;
}
.action-btn.v-btn--size-small {
  width: 45px;
  height: 45px;
  max-width: 45px;
  bottom: calc(56px - 18px);
  left: calc(50% - 18px);
}
.action-btn.v-btn--size-small i {
  font-size: 200% !important;
}
.v-item-group.v-bottom-navigation .v-btn.align-center {
  height: 100%;
}
.v-item-group.v-bottom-navigation .main-fab.v-btn--fab {
  box-shadow: #fff 0px 0px 0px 3px;
}
.v-item-group.v-bottom-navigation .main-fab.v-btn--fab.v-size--small {
  width: 40px;
  height: 40px;
  min-width: 40px;
}
.v-item-group.v-bottom-navigation .main-fab:v-deep(.v-btn--fab.v-size--default) {
  width: 56px;
  height: 56px;
  min-width: 56px;
  max-width: 56px;
}
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
