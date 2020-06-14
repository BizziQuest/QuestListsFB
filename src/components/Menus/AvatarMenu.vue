<template>
  <div>
    <v-menu center offset-y bottom origin="center center" transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-avatar avatarStyle="Transparent" class="profile" color="grey" size="60">
            <v-img :src="getAvatar"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
          <v-subheader class="d-flex justify-center">
            <span style="font-size: 18px;">Profile Actions</span>
          </v-subheader>
        <v-divider light></v-divider>
        <v-list-item class="d-flex justify-center">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="primary--text"
                text
                v-bind="attrs"
                v-on="on"
                v-on:click="goToEditInfo"
              ><v-icon>edit</v-icon></v-btn>
            </template>
            <span>Edit Profile</span>
          </v-tooltip>
        </v-list-item>
        <v-divider light></v-divider>
        <v-list-item class="d-flex justify-center">
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
  computed: {
    getAvatar() {
      return this.$store.state.user.avatar;
    },
  },
  methods: {
    goToEditInfo() {
      this.$router.push('EditInfo');
    },
  },
};
</script>

<style lang="scss" scoped></style>
