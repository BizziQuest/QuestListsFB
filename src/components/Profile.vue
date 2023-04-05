<template>
  <div class="d-flex align-center justify-center h-100">
    <v-card
      width="500"
      elevation="3"
      shaped
      variant="tonal"
    >
      <v-card-text class="d-flex flex-column align-center">
        <h1>
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
        <v-form ref="infoForm">
          <v-container class="px-4">
              <v-text-field
                v-model="displayName"
                test-displayname-input
                label="Display Name"
                variant="solo"
                clearable
                color="primary"
                required
              ></v-text-field>
              <v-text-field
                v-model="avatar"
                test-avatar-input
                variant="solo"
                clearable
                :disabled="useGravatar"
                label="Customized Avatar URL"
                color="primary"
              ></v-text-field>
            <v-row class="justify-center">
              <v-checkbox
                v-model="useGravatar"
                test-use-gravatar-checkbox
                label="Use Gravatar"
                color="secondary"
                id="useGravatar"
                class="pr-3"
              />
              <div class="mt-4 mr-3">
              <v-tooltip location="bottom" text="Gravatar is a service for matching emails with avatars. Click sign-up to sign up for yours!">
                <template #activator="{ props }">
                  <v-icon
                    color="primary"
                    dark
                    v-bind="props"
                  >
                    mdi mdi-help-circle
                  </v-icon>
                </template>
              </v-tooltip>
              (<a
                target="_new"
                href="https://gravatar.com"
              >sign up</a>)
              </div>
            </v-row>
          </v-container>
        </v-form>
              <v-card-actions>
                <v-btn
                  class="error"
                  color="error"
                  x-large
                  text
                  test-cancel-button
                  @click="cancelForm"

                >
                  Reset
                </v-btn>
                <v-btn
                  class="success"
                  color="primary"
                  x-large
                  text
                  test-save-button
                  @click="saveForm"

                >
                  Save
                </v-btn>
              </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
// import { getAvatarForUser } from '../util';
import md5 from 'md5';

export default {
  name: 'Profile',
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
        return `https://www.gravatar.com/avatar/${md5(this.email)}?d=wavatar`;
      }
      return this.avatar || '/img/unknown_user.svg';
    },
  },
  methods: {
    ...mapActions(['notify']),
    saveForm() {
      const userInfo = {
        uid: this.currentUser?.uid,
        email: this.email,
        displayName: this.displayName || 'New Member',
        avatar: this.avatar || '/img/unknown_user.svg',
        useGravatar: this.useGravatar || false,
      };
      this.notify({text: "Profile Saved!", type: 'success'})
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

<style scoped>
:deep(.v-input.v-checkbox) {
  flex: none;
}
</style>
