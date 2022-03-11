<template>
  <div>
    <v-card class="mx-auto mt-10" max-width="500" raised shaped>
      <v-card-text class="d-flex flex-column align-center mt-10">
        <h1 class="mt-10">Edit Profile</h1>
        <v-avatar class="my-4" size="96">
          <v-img :src="avatarPreview" test-avatar-image />
        </v-avatar>
        <h4 class="">{{ currentUser.email }}</h4>
      </v-card-text>
      <v-card-actions>
        <v-form ref="infoForm" class="w-100 center px-3">
          <v-container>
            <v-row>
              <v-text-field
                test-dispalyname-input
                v-model="displayName"
                label="Display Name"
                clearable
                color="secondary"
                required
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                test-avatar-input
                v-model="avatar"
                clearable
                :disabled="useGravatar"
                label="Customized Avatar"
                color="secondary"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-checkbox
                test-useGravatar-checkbox
                v-model="useGravatar"
                label="Use Gravatar"
                color="secondary"
              ></v-checkbox>
              <label style="color: rgba(0, 0, 0, 0.6)" class="pt-5 pl-2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on"> mdi mdi-help-circle </v-icon>
                  </template>
                  <div style="width: 20vw">
                    Gravatar is a service for matching emails with avatars. Click sign-up to sign up for yours!
                  </div>
                </v-tooltip>
                (<a style="color: rgba(0, 0, 0, 0.6)" target="_new" href="https://gravatar.com">sign up</a>)
              </label>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="email" label="E-mail" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center justify-center">
                <v-btn
                  class="warning mr-5 text-large"
                  color="darken-1"
                  elevation="2"
                  test-save-button
                  v-on:click="loadFormData"
                  ><i class="mdi mdi-content-save-off"></i> Reset</v-btn
                >
                <v-btn class="success" color="darken-1" elevation="2" test-save-button v-on:click="saveForm"
                  ><i class="mdi mdi-content-save"></i> Update</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getGravatarForEmail } from '../util';

export default {
  name: 'EditInfo',
  data() {
    return {
      userId: null,
      displayName: null,
      avatar: null,
      email: null,
      useGravatar: false,
    };
  },
  computed: {
    ...mapState({
      currentUser(state) {
        if (!state.currentUser || !Object.prototype.hasOwnProperty.call(state.currentUser, 'uid')) return {};
        this.loadFormData();
        return state.currentUser;
      },
    }),
    avatarPreview() {
      if (this.useGravatar) {
        return getGravatarForEmail(this.email);
      }
      return this.avatar || '/img/unknown_user.svg';
    },
  },
  methods: {
    loadFormData() {
      const {
        displayName, email, avatar, uid, useGravatar,
      } = this.$store.state.currentUser;
      this.userId = uid;
      this.displayName = displayName;
      this.email = email;
      this.avatar = avatar;
      this.useGravatar = useGravatar || false;
    },
    saveForm() {
      const userInfo = {
        uid: this.currentUser.uid,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
        useGravatar: this.useGravatar || false,
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
  },
};
</script>
<style>
.w-100 {
  width: 100%;
}
</style>
