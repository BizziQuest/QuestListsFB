<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Create A List</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <user-auth-alert />
          <list-metadata-preferences></list-metadata-preferences>
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
import { ensureSlugUniqueness, auth } from '../firebase';
import ListMetadataPreferences from './preferences/ListMetadataPreferences.vue';

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
    ListMetadataPreferences,
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
