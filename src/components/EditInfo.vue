<!--eslint-disable-file vuejs-accessibility/label-has-for -->
<template>
  <div>
    <v-card
      class="mx-auto mt-10"
      max-width="500"
      raised
      shaped
    >
      <v-card-text class="d-flex flex-column align-center mt-10">
        <h1 class="mt-10">
          Edit Profile
        </h1>
        <v-avatar
          class="my-4"
          size="96"
        >
          <v-img
            :src="avatarPreview"
            test-avatar-image
          />
        </v-avatar>
        <h4 class="">
          {{ currentUser.email }}
        </h4>
      </v-card-text>
      <v-card-actions>
        <v-form ref="infoForm">
          <v-container>
            <v-row>
              <v-text-field
                v-model="displayName"
                test-dispalyname-input
                label="Display Name"
                clearable
                color="secondary"
                required
              />
            </v-row>
            <v-row>
              <v-text-field
                v-model="avatar"
                test-avatar-input
                clearable
                :disabled="useGravatar"
                label="Customized Avatar"
                color="secondary"
              />
            </v-row>
            <v-row>
              <v-checkbox
                v-model="useGravatar"
                test-use-gravatar-checkbox
                label="Use Gravatar"
                color="secondary"
                id="useGravatar"
              />
              <label
                style="color: rgba(0, 0, 0, 0.6)"
                class="pt-5 pl-2"
                for="useGravatar"
              >
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi mdi-help-circle
                    </v-icon>
                  </template>
                  <div style="width: 20vw">
                    Gravatar is a service for matching emails with avatars. Click sign-up to sign up for yours!
                  </div>
                </v-tooltip>
                (<a
                  style="color: rgba(0, 0, 0, 0.6)"
                  target="_new"
                  href="https://gravatar.com"
                >sign up</a>)
              </label>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  disabled
                />
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
                  test-save-button
                  @click="saveForm"
                >
                  Save Profile
                </v-btn>
                <v-btn
                  test-cancel-button
                  class="success"
                  color="darken-1"
                  elevation="2"
                  x-large
                  rounded
                  text
                  @click="cancelForm"
                >
                  Cancel Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { getAvatarForUser } from '../util';
import md5 from 'md5';

export default {
  name: 'EditInfo',
  data() {
    return {
      userId: null,
      displayName: null,
      avatar: null,
      email: null,
      useGravatar: false,
    };
  },
  computed: {
    ...mapState({
      currentUser(state) {
        if (!state.currentUser || !Object.prototype.hasOwnProperty.call(state.currentUser, 'uid')) return {};
        const {
          displayName, email, avatar, uid, useGravatar,
        } = state.currentUser;
        this.userId = uid;
        this.displayName = displayName;
        this.email = email;
        this.avatar = avatar;
        this.useGravatar = useGravatar || false;
        return state.currentUser;
      },
    }),
    avatarPreview() {
      if (this.useGravatar) {
        return `https://www.gravatar.com/avatar/${md5(this.email)}`;
      }
      return this.avatar || '/img/unknown_user.svg';
    },
  },
  methods: {
    saveForm() {
      const userInfo = {
        uid: this.currentUser?.uid,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
        useGravatar: this.useGravatar || false,
      };
      this.$store.dispatch('saveProfile', userInfo);
    },
    cancelForm() {
      const {
        displayName, email, avatar, uid,
      } = this.$store.state.currentUser;
      if (uid) {
        this.userId = uid;
        this.displayName = displayName || this.displayName;
        this.email = email;
        this.avatar = avatar || this.avatar;
        this.useGravatar = false;
      }
    },
  },
};
</script>
