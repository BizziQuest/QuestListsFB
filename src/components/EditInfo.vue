<template>
  <div>
    <v-card class="mx-auto mt-10" max-width="500" raised shaped>
      <v-card-text>
        <v-avatar class="d-flex justify-center align-center">
          <img :src="avatar"/>
        </v-avatar>
        <h1 class="d-flex justify-center align-center mt-10">Edit Info</h1>
        <h4 class="d-flex justify-center align-center mt-10">{{currentUser.email}}</h4>
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
                @click:clear="unCheckAvatar()"
                label="Avatar" color="secondary"></v-text-field>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="useGravatar"
                label="Use Gravatar"
                color="secondary"
                @click= "useOrNotUseGravatar"></v-checkbox>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="email" label="E-mail" disabled></v-text-field>
              </v-col>
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
import md5 from 'md5';

export default {
  name: 'EditInfo',
  data() {
    return {
      userId: null,
      displayName: null,
      avatar: null,
      $_tempAvatar: null,
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
        this.useGravatar = useGravatar || false;
        return state.currentUser;
      },
    }),
  },
  methods: {
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
    useOrNotUseGravatar() {
      if (this.useGravatar) {
        this.$_tempAvatar = this.avatar;
        this.avatar = `https://www.gravatar.com/avatar/${md5(this.email)}`;
      } else {
        // this.avatar = '/img/unknown_user.svg';
        this.avatar = this.$_tempAvatar;
      }
    },
    unCheckAvatar() {
      this.useGravatar = false;
    },
  },
};
</script>
