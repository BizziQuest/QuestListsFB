<template>
    <div>
        <v-menu center
                offset-y
                bottom
                origin="center center"
                transition="scale-transition">
            <template v-slot:activator="{ on }">
                <v-btn
                    dark
                    icon
                    v-on="on"
                >
                    <v-avatar
                        avatarStyle='Transparent'
                        class="profile"
                        color="grey"
                        size="60"
                        >
                        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                    </v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <LogOut></LogOut>
              </v-list-item>
            </v-list>
          </v-menu>
    </div>
</template>

<script>
import LogOut from '../LogOut.vue';

export default {
  name: 'AvatarMenu',
  components: {
    LogOut,
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
