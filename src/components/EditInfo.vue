<template>
  <div>
    <v-card class="mx-auto mt-10" max-width="500" raised shaped>
      <v-card-text>
        <h1 class="d-flex justify-center align-center mt-10">Edit Info</h1>
      </v-card-text>
      <v-card-actions>
        <v-form ref="editForm">
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
                  v-on:click="editForm"
                >Edit</v-btn>
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

export default {
  name: 'EditInfo',
  data() {
    return {
      userId: null,
      displayName: null,
      avatar: null,
      email: null,
    };
  },
  computed: {
    ...mapState({
      currentUser(state) {
        const {
          displayName,
          email,
          avatar,
          id,
        } = state.currentUser;
        console.log('USER: ', state.currentUser);
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
    editForm() {
      const userInfo = {
        id: this.currentUser.id,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
  },
};
</script>
