<template>
  <div>
    <h1 class="d-flex justify-center align-center mt-10">Edit Info</h1>
    <v-form ref="editForm">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              label="First name"
              clearable
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="lastname" :rules="nameRules" clearable label="Last name" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="email" label="E-mail" disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex align-center justify-center">
            <v-btn class="success" color="darken-1" elevation="2" x-large rounded text>
              Edit
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
            {{user}}
            <br>
            {{firebaseUser}}
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { auth } from '../main'; // eslint-disable-line import/no-cycle

export default {
  name: 'EditInfo',
  data() {
    return {
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        // (v) => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      email: '',
    };
  },
  created() {
    this.email = this.user.email;
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
    async submitEdit() {
      if (this.$refs.editForm.vaildate()) {
        // if (this.firstname.length !== 0) {
        //   const response = await auth.currentUser.updateProfile({
        //     displayName: this.firstname,
        //   });
        //   console.log('edit first name ', response);
        // } else if (this.lastname.length !== 0) {
        //   const response = await auth.currentUser.updateProfile({
        //     displayName: this.lastname,
        //   });
        //   console.log('edit first name ', response);
        // } else {
        const response = await auth.currentUser.updateProfile({
          displayName: this.fistname + this.lastname,
        });
        console.log('edit full name ', response);
      }
    },
  },
  // },
};
</script>

<style lang="scss" scoped></style>
