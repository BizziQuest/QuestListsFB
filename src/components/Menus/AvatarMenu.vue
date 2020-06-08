<template>
  <div>
    <v-menu center offset-y bottom origin="center center" transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-avatar avatarStyle="Transparent" class="profile" color="grey" size="60">
            <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-btn outlined class="primary z-depth-0 darken pl-2" v-on:click="goToEditInfo">Edit Info</v-btn>
        </v-list-item>
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
    return {};
  },
  methods: {
    goToEditInfo() {
      this.$router.push('EditInfo');
    },
  },
};
</script>

<style lang="scss" scoped></style>
