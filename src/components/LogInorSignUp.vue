<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn outlined class="primary z-depth-0 darken" v-on="on"> Log In / Sign up</v-btn>
      </template>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">Log In or Sign Up</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="email" outlined  label="Email*" required clearable></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="password" outlined label="Password*" type="password" required clearable>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="success" color="darken-1" elevation="2" x-large rounded text @click="dialog = false">
            Cancel</v-btn>
            <v-btn class="success" color="darken-1"  elevation="2" x-large rounded text @click="loginOrSignUser()">
            Log In</v-btn>
            <v-btn class="success" color="darken-1" elevation="2" x-large rounded text
            @click="loginOrSignUser(true)"> Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: 'LogInorSignUp',
  data() {
    return {
      email: null,
      password: null,
      dialog: false,
    };
  },
  methods: {
    loginOrSignUser(signup = false) {
      const action = signup ? 'signupUser' : 'loginUser';
      if (this.$refs.form.validate()) {
        console.debug(action);
        this.$store.dispatch(action, {
          email: this.email,
          password: this.password,
        });
        this.$refs.form.reset();
        this.dialog = false;
      }
    },
  },
};
</script>
