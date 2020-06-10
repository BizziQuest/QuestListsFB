<template>
  <div>
    <h1 class="d-flex justify-center align-center mt-10">Edit Info</h1>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              :counter="10"
              label="First name"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="lastname" :rules="nameRules" :counter="10" label="Last name" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="email" label="E-mail" disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex align-center justify-center">
            <v-btn color="error" class="mr-4">
              Edit
            </v-btn></v-col
          >
        </v-row>
      </v-container>
    </v-form>
    {{user}}
  </div>
</template>

<script>
export default {
  name: 'EditInfo',
  data() {
    return {
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      email: '',
    };
  },
  mounted() {
    this.email = this.user.email;
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style lang="scss" scoped></style>
