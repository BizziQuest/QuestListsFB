<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Create A List</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <user-auth-alert />
          <v-form ref="addTitleAndColorForm" v-model="formIsValid" @submit.prevent>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="List Title*"
                  :rules="titleRules"
                  v-model="title"
                  required
                  placeholder="Your Title"
                  outlined
                  test-title-input
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <color-input :outline="true" v-model="listColor" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  label="Description"
                  v-model="description"
                  required
                  placeholder="Describe your list purpose."
                  outlined
                  test-description-input
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-checkbox v-model="adultContent" test-adult-content class="mx-5" label="Adult Content" hide-details>
            </v-checkbox>
            <v-tooltip right max-width="200">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="ml-4 mt-3" color="info" dark v-bind="attrs" v-on="on">help</v-icon>
              </template>
              <span
                >Adult-oriented content is content which may include nudity, strong sexual themes, or strong
                descriptions of violence. Examples include Questlists for Cyberpunk 2077 or Grand Theft Auto; Questlists
                of adult web sites or subreddits;
              </span>
            </v-tooltip>
          </v-row>
          <states-editor :reset="reset" :stateGroup="defaultStateGroup" @list:updated="listUpdated" />
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue" name="submit" elevation-13 test-submit-form @click="createAList">Create</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import StatesEditor from './StatesEditor.vue';
import UserAuthAlert from './UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import ColorInput from './ColorInput.vue';

import { ensureSlugUniqueness, auth } from '../firebase';

const defaultFormData = {
  title: '',
  newState: '',
  newItem: '',
  statesPicked: '',
  updatedListStatesItems: [],
  description: '',
  listColor: '',
  colorPickerShown: false,
};

export default {
  name: 'CreateAList',
  mixins: [userAuthMixin],
  components: {
    StatesEditor,
    UserAuthAlert,
    ColorInput,
  },
  data() {
    return {
      ...defaultFormData,
      adultContent: false,
      formIsValid: false,
      reset: 0,
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length > 5) || 'Title must be longer than 5 characters',
      ],
    };
  },
  props: {
    dark: {
      default: true,
      type: Boolean,
    },
    light: {
      default: true,
      type: Boolean,
    },
    fab: {
      description: 'Shows this as a fab',
      default: false,
      type: Boolean,
    },
  },
  methods: {
    ...mapMutations(['setItemStates']),
    ...mapActions(['createList', 'notify']),
    listUpdated($event) {
      this.updatedListStatesItems = $event;
    },
    async createAList() {
      if (this.$refs.addTitleAndColorForm.validate() === false) {
        this.$refs.addTitleAndColorForm.$el.scrollIntoView({ behavior: 'smooth' });
        this.notify({ type: 'error', text: 'There were problems creating your QuestList.' });
        return;
      }
      // TODO: add an input for the name and description for this stateGroup
      let stateGroup = this.defaultStateGroup;
      if (this.updatedListStatesItems.length > 0) {
        stateGroup = {
          name: this.updatedListStatesItems.map((s) => s.text).join(', '),
          description: '',
          states: this.updatedListStatesItems,
        };
      } else {
        this.notify({ type: 'info', text: 'No states configured. Using default states.' });
      }
      const payload = {
        adultContent: this.adultContent,
        title: this.title,
        slug: await ensureSlugUniqueness(this.title),
        color: this.listColor,
        stateGroup,
        description: this.description,
        createdAt: Date.now(),
        createdBy: auth.currentUser?.uid,
        parent: 'none',
      };
      this.createList(payload);
      this.reset += 1;
    },
    swatchStyle() {
      return {
        backgroundColor: this.listColor,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
  },
  computed: {
    ...mapState(['globalPreferences']),
    defaultStateGroup() {
      return { ...this.globalPreferences.defaultStateGroup };
    },

  },
};
</script>
<style lang="scss" scoped>
#availableListStates {
  height: 100px;
  overflow: auto;
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #ffffff !important;
}
.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #ffffff !important;
}
.color-picker-swatch {
  border: #797979 1px solid;
}

</style>
