<template>
  <v-dialog
    v-model="dialog"
    persistent
    :dark="dark"
    max-width="600px"
  >
    <template #activator="{ props }">
        <v-list-item
          :dark="dark"
          test-open-dialog
          v-bind="props"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-arrow-right</v-icon>
          </template>
          <v-list-item-title v-text="'Sign In or Sign Up'" class="ml-4"/>
        </v-list-item>
    </template>
    <v-form ref="form">
      <v-card>
        <v-card-title>
          <span class="headline">Log In or Sign Up</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                test-email-field
                :rules="[rules.emailPresent, rules.emailFormat]"
                outlined
                label="Email*"
                required
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                test-password-field
                :rules="[rules.passwordPresent, rules.passwordLength]"
                outlined
                label="Password*"
                type="password"
                required
                counter
                clearable
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="secondary"
              text
              @click="googleSignin()"
            >
              <v-icon>mdi-google</v-icon>
            </v-btn>
            <v-btn
              color="secondary"
              text
              @click="faceBookSignin()"
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary-lighten1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="success"
            test-login-button
            text
            @click="loginOrSignUser()"
          >
            Log In
          </v-btn>
          <v-btn
            color="secondary"
            text
            test-signup-button
            @click="loginOrSignUser(true)"
          >
            Sign Up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
export default {
  name: 'LogInorSignUp',
  props: {
    dark: {
      description: 'sets the dark mode on this component.',
      default: false,
      type: Boolean,
    },
    toolbar: {
      description: 'Shows this as if it were in a toolbar instead of a list.',
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      email: null,
      password: null,
      dialog: false,
      rules: {
        emailPresent: (v) => !!v || 'Email is required',
        emailFormat: (v) =>
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) // eslint-disable-line implicit-arrow-linebreak, max-len
          || 'Email is in an invalid format',
        passwordPresent: (v) => !!v || 'Password is required',
        passwordLength: (v) => (!!v && v.length > 8) || 'Password must be at least 8 characters',
      },
    };
  },
  methods: {
    loginOrSignUser(signup = false) {
      const action = signup ? 'signupUser' : 'loginUser';
      if (this.$refs.form.validate()) {
        this.$store.dispatch(action, {
          email: this.email,
          password: this.password,
        });
        this.$refs.form.reset();
        this.dialog = false;
      }
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
