<template>
  <v-dialog v-model="dialog" persistent :dark='dark' max-width="600px">
    <template v-slot:activator="{ on }">
      <slot :on="on">
        <v-list-item link :dark="dark" v-on="on" title="Sign In / Sign Up">
          <v-list-item-action>
            <v-icon>mdi-account-arrow-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign In or Sign Up</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </slot>
    </template>
    <v-form ref="form">
      <v-card>
        <v-card-title>
          <span class="headline">Log In or Sign Up</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="email" outlined  label="Email*" required clearable></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="password" outlined label="Password*" type="password" required clearable>
              </v-text-field>
            </v-col>
          </v-row>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="secondary" text @click = "googleSignin()">
            <v-icon >mdi-google</v-icon>
          </v-btn>
          <v-btn  color="secondary"
                  text
                  @click = "faceBookSignin()">
            <v-icon >mdi-facebook</v-icon>
          </v-btn>
          <v-spacer/>
        </v-card-actions>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary-lighten1" text @click="dialog = false">
          Cancel</v-btn>
          <v-spacer/>
          <v-btn color="success" text @click="loginOrSignUser()">
          Log In</v-btn>
          <v-btn color="secondary" text
          @click="loginOrSignUser(true)"> Sign Up</v-btn>
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
