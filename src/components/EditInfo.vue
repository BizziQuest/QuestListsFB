<template>
  <div>
    <v-card class="mx-auto mt-10"  max-width="500" raised shaped>
      <v-card-text>
        <h1 class="d-flex justify-center align-center mt-10">Edit Info</h1>
      </v-card-text>
      <v-card-actions>
        <v-form ref="editForm">
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="firstName"
                  label="First name"
                  clearable
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="lastName"
                  clearable
                  label="Last name" required></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="email" label="E-mail" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex align-center justify-center">
                <v-btn class="success" color="darken-1" elevation="2" x-large rounded text v-on:click="editForm">
                  Edit
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              {{ user }}
              <br />
              displayname: {{ firebaseUser.displayName }}
            </v-row>
          </v-container>
        </v-form>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { auth } from '../main'; // eslint-disable-line import/no-cycle

export default {
  name: 'EditInfo',
  data() {
    return {
      valid: false,
      firstName: '',
      lastName: '',
      nameRules: [(v) => !!v || 'Name is required'],
      email: '',
    };
  },
  mounted() {
    console.log(this.firebaseUser.displayName);
    if (this.firebaseUser.displayName) {
      // eslint-disable-next-line prefer-destructuring
      this.firstName = this.firebaseUser.displayName.split(' ')[0];
      // eslint-disable-next-line prefer-destructuring
      this.lastName = this.firebaseUser.displayName.split(' ')[1];
    }

    this.email = this.firebaseUser.email;
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    firebaseUser() {
      return auth.currentUser;
    },
  },
  methods: {
    async editForm() {
      if (this.lastName.length !== 0 && this.firstName.length !== 0) {
        const response = await auth.currentUser.updateProfile({
          displayName: this.firstName.concat(' ', this.lastName),
        });
        console.log(response, auth.currentUser);
      }
    },
  },
};
</script>
