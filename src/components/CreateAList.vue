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
                <v-text-field
                  label="Color"
                  :rules="colorPickerRules"
                  v-model="listColor"
                  placeholder="#FFFFFF"
                  outlined
                  test-color-input
                >
                  <template v-slot:append>
                    <v-menu :close-on-content-click="false" :close-on-click="false" v-model="colorPickerShown" left top>
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle()" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text>
                          <CustomColorPicker v-model="listColor" />
                          <v-row align="center">
                            <v-btn @click="colorPickerShown = false" class="mx-auto mt-3">Close</v-btn>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
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
          <states-editor :stateGroup="getGlobalPreferences.defaultStateGroup" @list:updated="listUpdated" />
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import StatesEditor from './StatesEditor.vue';
import UserAuthAlert from './UserAuthAlert.vue';
import userAuthMixin from '../mixins/UserAuth.vue';
import CustomColorPicker from './CustomColorPicker.vue';
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
    CustomColorPicker,
  },
  data() {
    return {
      ...defaultFormData,
      adultContent: false,
      dialog: false,
      formIsValid: false,
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length > 5) || 'Title must be longer than 5 characters',
      ],
      colorPickerRules: [
        (v) => !v || /^#([A-F0-9]{3}){1,2}$/i.test(v) || 'Color Format Must be #FFF or #FFFFFF, case-insensitive',
      ],
    };
  },
  props: {
    highlightColor: {
      default: undefined,
    },
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
    closeMenu() {
      this.closeOnClick = true;
    },
    ...mapMutations(['setItemStates']),
    ...mapActions(['createList', 'notify']),
    listUpdated($event) {
      this.updatedListStatesItems = $event;
    },
    async createAList() {
      if (this.$refs.addTitleAndColorForm.validate() === false) {
        this.$refs.addTitleAndColorForm.$el.scrollIntoView();
        this.notify({ type: 'error', text: 'There were problems creating your QuestList.' });
        return;
      }
      // TODO: add an input for the name and description for this stateGroup
      let stateGroup = this.getGlobalPreferences.defaultStateGroup;
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
        createdBy: auth.currentUser.uid,
        parent: 'none',
      };
      this.createList(payload);
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
    ensureNewState(index, state) {
      const lastStateIndex = this.itemStates.length - 1;
      if (index === lastStateIndex) {
        if (state.length !== 0) {
          this.itemStates.push({ icon: 'mdi-plus', text: 'New Item' });
        }
      }
    },
  },
  computed: {
    ...mapGetters(['getGlobalPreferences']),
  },
  mounted() {
    if (this.$route.query?.newQuest) {
      this.dialog = true;
    }
  },
  watch: {
    dialog(showDialog) {
      const newQuery = { ...this.$route.query };
      if (!showDialog) {
        // this.resetForm();  // when user clicks outside dialog, reset form?
        delete newQuery.newQuest;
      } else {
        newQuery.newQuest = 'true';
      }
      if (this.$route.query.newQuest !== newQuery.newQuest) {
        this.$router.push({ query: newQuery });
      }
      this.verifyUser();
    },
  },
};
</script>
<style scoped>
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
</style>
