<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn outlined class="primary z-depth-0 darken" v-on="on">Sign Up</v-btn>
      </template>
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">Sign Up Form</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="Email*"
                    autocomplete="email"
                    type="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    autocomplete="new-password"
                    label="Password*"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="signupUser()">Sign up</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      dialog: false,
      email: null,
      password: null
    };
  },
  methods: {
    signupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          email: this.email,
          password: this.password
        });
        this.$refs.form.reset();
        this.dialog = false;
      }
    }
  }
};
</script>