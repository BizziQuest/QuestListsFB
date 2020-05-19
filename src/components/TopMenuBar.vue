<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon v-on:click="openOrCloseDrawer(drawer)"></v-app-bar-nav-icon>
    <span class="title ml-3 mr-5">
      Quest
      <span class="font-weight-light">Lists</span>
    </span>
    <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field>
    <v-spacer></v-spacer>
    <span v-if="isUserUthenticated">
      <logout-btn></logout-btn>
    </span>
    <span v-else>
      <signup-btn></signup-btn>
      <login-btn></login-btn>
    </span>
  </v-app-bar>
</template>
<script>
import SignUp from "../components/SignUp";
import LogIn from "../components/LogIn";
import LogOut from "../components/LogOut";
export default {
  name: "TopMenuBar",
  props: ["drawer"],
  components: {
    "signup-btn": SignUp,
    "login-btn": LogIn,
    "logout-btn": LogOut
  },
  computed: {
  
    isUserUthenticated() {
      return (
        this.$store.getters.user !== undefined &&
        this.$store.getters.user !== null
      );
    }
  },
  methods: {
    openOrCloseDrawer(drawerProp) {
      //https://antenna.io/blog/2018/01/state-management-in-vue-js/
      //  Avoid mutating a prop directly since the value will be overwritten whenever
      //  the parent component re-renders issue
      // using sync
      // drawerProp = !drawerProp;
      // alert(drawerProp);
      // this.$emit("updrawer-status", drawerProp);
      this.$emit("update:drawer", !drawerProp);
    }
  }
};
</script>