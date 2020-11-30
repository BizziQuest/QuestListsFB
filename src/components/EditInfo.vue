<template>
  <div>
    <v-card class="mx-auto mt-10" max-width="500" raised shaped>
      <v-card-text class="d-flex flex-column align-center mt-10">
        <h1 class="mt-10">Edit Profile</h1>
        <v-avatar class="my-4" size="96">
          <img :src="avatarPreview"/>
        </v-avatar>
        <h4 class="">{{currentUser.email}}</h4>
      </v-card-text>
      <v-card-actions>
        <v-form ref="infoForm">
          <v-container>
            <v-row>
                <v-text-field
                 v-model="displayName"
                 label="Display Name"
                 clearable
                 color="secondary"
                 required></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="avatar"
                clearable
                :disabled="useGravatar"
                label="Customized Avatar" color="secondary"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="useGravatar"
                label="Use Gravatar"
                color="secondary"
               ></v-checkbox>
               <label class="pt-5 pl-2">(<a href="https://gravatar.com">sign up</a>)</label>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center justify-center">
                <v-btn
                  class="success"
                  color="darken-1"
                  elevation="2"
                  x-large
                  rounded
                  text
                  v-on:click="saveForm"
                >Save Profile</v-btn>
                                <v-btn
                  class="success"
                  color="darken-1"
                  elevation="2"
                  x-large
                  rounded
                  text
                  v-on:click="cancelForm"
                >Cancel Changes</v-btn>
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
import { getAvatarForUser } from '../util';

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
        if (!state.currentUser
            || !Object.prototype.hasOwnProperty.call(state.currentUser, 'uid')) return {};
        const {
          displayName,
          email,
          avatar,
          uid,
          useGravatar,
        } = state.currentUser;
        this.userId = uid;
        this.displayName = displayName;
        this.email = email;
        this.avatar = avatar;
        this.useGravatar = !!useGravatar;
        return state.currentUser;
      },
    }),
    avatarPreview() {
      return getAvatarForUser({
        useGravatar: this.useGravatar,
        email: this.email,
        avatar: this.avatar,
        displayName: this.displayName,
      });
    },
  },
  methods: {
    saveForm() {
      const userInfo = {
        uid: this.currentUser.uid,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
        useGravatar: !!this.useGravatar,
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
    cancelForm() {
      const {
        displayName,
        email,
        avatar,
        uid,
      } = this.$store.state.currentUser;
      if (uid) {
        this.userId = uid;
        this.displayName = displayName || this.displayName;
        this.email = email;
        this.avatar = avatar || this.avatar;
        this.useGravatar = false;
      }
    },
  },
};
</script>
