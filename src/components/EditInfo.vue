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
      email: null,
      useGravatar: false,
    };
  },
  computed: {
    ...mapState({
      currentUser(state) {
        // this needs to be here due to the async nature of firebase user retrieval
        if (!state.currentUser) {
          this.userId = null;
          this.displayName = null;
          this.avatar = null;
          this.email = null;
          this.useGravatar = false;
          return {};
        }
        const {
          displayName,
          email,
          avatar,
          id,
        } = state.currentUser;
        if (id) {
          this.userId = id;
          this.displayName = displayName || this.displayName;
          this.email = email;
          this.avatar = avatar || this.avatar;
        }
        return state.currentUser;
      },
    }),
  },
  methods: {
    saveForm() {
      const userInfo = {
        id: this.currentUser.id,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
    cancelForm() {
      const {
        displayName,
        email,
        avatar,
        id,
      } = this.$store.state.currentUser;
      if (id) {
        this.userId = id;
        this.displayName = displayName || this.displayName;
        this.email = email;
        this.avatar = avatar || this.avatar;
        this.useGravatar = false;
      }
    },
    useOrNotUseGravatar(event) {
      console.log(event);
      if (this.useGravatar) {
        console.log(this.useGravatar);
        this.avatar = `https://www.gravatar.com/avatar/${md5(this.email)}`;
      } else {
        this.avatar = '/img/unknown_user.svg';
      }
    },
  },
};
</script>
