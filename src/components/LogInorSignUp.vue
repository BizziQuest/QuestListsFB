<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="success" color="darken-1" elevation="2" large rounded text v-on="on"> Log In / Sign up</v-btn>
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
                  <v-text-field
                    v-model="email"
                    :rules = "emailRules"
                    outlined
                    label="Email*"
                    clearable
                    test-email-field
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :rules = "passwordRules"
                     outlined
                     counter
                     hint="minimum of 8 characters"
                     label="Password*"
                     type="password"
                     clearable
                     test-password-field>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn test-cancel-button x-large rounded text
              class="success" color="darken-1" elevation="2" @click="closeDialog"
            >
            Cancel</v-btn>
            <v-btn test-login-button x-large rounded text
              class="success" color="darken-1"  elevation="2" @click="loginOrSignUser()"
            >
            Log In</v-btn>
            <v-btn class="success" color="darken-1" elevation="2" test-signup-button  x-large rounded text
            @click="loginOrSignUser(true)"> Sign Up</v-btn>
            <v-btn class="success" color="darken-1"  elevation="2"  x-large rounded text
                   @click = "googleSignin()">
              <v-icon >mdi-google</v-icon>
            </v-btn>
            <v-btn class="success"
                   color="darken-1"
                   elevation="2"
                   x-large
                   rounded
                   text
                   @click = "faceBookSignin()">
              <v-icon >mdi-facebook</v-icon>
            </v-btn>
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
      action: false,
      email: null,
      emailRules: [
        (v) => !this.action || !!v || 'E-mail is required.',
        (v) => !this.action || /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: null,
      passwordRules: [
        (v) => !this.action || !!v || 'Password is required',
        (v) => this.action !== 'signupUser' || v?.length >= 8
              || 'Password must be at least 8 characters.',
      ],
      dialog: false,
    };
  },
  methods: {
    loginOrSignUser(signup = false) {
      this.action = signup ? 'signupUser' : 'loginUser';
      if (this.$refs.form.validate()) {
        this.$store.dispatch(this.action, {
          email: this.email,
          password: this.password,
        });
        this.closeDialog();
      }
      this.action = false;
    },
    closeDialog() {
      this.$refs.form.reset();
      this.action = false;
      this.dialog = false;
    },
    googleSignin() {
      this.$store.dispatch('googleSigninoAuth');
    },
    faceBookSignin() {
      this.$store.dispatch('faceBookSigninoAuth');
    },
  },
};
</script>
