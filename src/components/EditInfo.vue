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
              <v-col cols="12" md="12">
                <v-text-field v-model="displayName" label="Display Name" clearable required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="avatar" clearable label="Avatar"></v-text-field>
              </v-col>
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
            <v-row>{{ user }}</v-row>
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
      displayName: '',
      avatar: '',
      email: '',
    };
  },
  computed: {
    ...mapState({
      user(state) {
        if (!state.user) {
          return state.user;
        }
        this.displayName = state.user.displayName;
        this.email = state.user.email;
        this.avatar = state.user.avatar;
        return state.user;
      },
    }),
  },
  methods: {
    editForm() {
      const userInfo = {
        id: this.user.id,
        email: this.email,
        displayName: this.displayName,
        avatar: this.avatar,
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
  },
};
</script>
