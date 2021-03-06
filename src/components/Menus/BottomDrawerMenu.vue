<template>
    <v-bottom-navigation
      fixed
      v-if="isMobile"
      :app="isMobile"
      :input-value="isMobile"
      :dark="!isDark"
      :light="isDark"
      grow
      >
        <v-btn
          :color="menuHighlightColor"
          icon
          title="View App Menu"
          @click="$emit('update:drawer', !drawer)"
        >
          <span>QuestLists</span>
          <v-icon style="d-inline">mdi-shield-check-outline</v-icon>
        </v-btn>
        <v-btn value="search" icon to="/search" :color="menuHighlightColor">
          <span>Search</span>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <CreateAList
          :dark="!isDark"
          :light="isDark"
          :showDialog="showCreateList"
          :highlightColor="menuHighlightColor"
          fab>
          <template v-slot:default="slotProps">
            <v-btn fab
              :dark="!isDark" :color="menuHighlightColor"
              absolute top center
              medium
              class="rounded-circle main-fab"
              v-on="slotProps.on"
            >
              <v-icon>mdi-shield-plus-outline</v-icon>
            </v-btn>
          </template>
        </CreateAList>
        <v-btn value="favorite" icon to="/favorites" :color="menuHighlightColor">
          <span>Favorites</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <user-menu-item :dark="!isDark" :light="isDark" class="d-flex flex-column align-center">
          <template v-slot:login="slotProps">
            <v-btn value="signIn" v-on="slotProps.on" icon :color="menuHighlightColor">
              <span>Sign In</span>
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
          </template>
          <template v-slot:avatar="slotProps">
            <v-btn value="viewProfile"
              class="d-flex flex-column text-truncate align-center"
              icon to="/EditInfo" :color="menuHighlightColor"
            >
              <span class="text-truncate d-inline-block" style="max-width:100px">{{slotProps.username}}</span>
              <v-avatar size="24">
                <v-img v-if="slotProps.avatar" :src="slotProps.avatar"/>
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
        </user-menu-item>
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
.v-item-group.v-bottom-navigation .main-fab.v-btn--fab.v-size--default {
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
