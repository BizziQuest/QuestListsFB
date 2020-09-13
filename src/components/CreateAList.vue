<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" class="primary">
      <template v-slot:activator="{ on }">
        <v-list-item link v-on="on">
          <v-list-item-action>
            <v-icon color="secondary">add</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title color="secondary">create a list</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create A List</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="addTitleAndColorForm" @submit.prevent>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="List Title*"
                    :rules="titleRules"
                    v-model="title"
                    required
                    placeholder="Your Title"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Color*"
                    :rules="colorPickerRules"
                    v-model="color"
                    placeholder="#FFFFFF"
                    outlined
                  >
                    <template v-slot:append>
                      <v-menu>
                        <template v-slot:activator="{ on }">
                          <div :style="swatchStyle()" v-on="on" />
                        </template>
                        <v-card>
                          <v-card-text>
                            <v-color-picker v-model="color" flat />
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                label="Description"
                 v-model='description'
                 required
                 placeholder="Describe your list purpose."
                 outlined></v-text-field>
              </v-col>
            </v-row>
            <states-editor :stateGroup="getGlobalPreferences.defaultStateGroup"
                           @list:updated="listUpdated"
            />
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="resetTitleAndColorForm">Close</v-btn>
          <v-btn color="blue darken-1" text @click="createAList">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import StatesEditor from './StatesEditor.vue';

export default {
  name: 'CreateAList',
  components: {
    StatesEditor,
  },
  data() {
    return {
      color: '#A0E9C9FF',
      title: '',
      menu: false,
      dialog: false,
      newState: '',
      newItem: '',
      statesPicked: '',
      updatedListStatesItems: [],
      description: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length > 5) || 'Title must be longer than 5 characters',
      ],
      colorPickerRules: [
        (v) => !!v || 'Color is required',
        (v) => /^#([A-F0-9]{3}){1,2}$/i.test(v) || 'Color Format Must be #FFF or #FFFFFF, case-insensitive',
      ],
    };
  },
  methods: {
    ...mapMutations(['setItemStates']),
    listUpdated($event) {
      this.updatedListStatesItems = $event;
    },
    createAList() {
      if (this.$refs.addTitleAndColorForm.validate()) {
        // TODO: add an input for the name and description for this stateGroup
        let stateGroup = this.getGlobalPreferences.defaultStateGroup;
        if (this.updatedListStatesItems.length > 0) {
          stateGroup = {
            name: this.updatedListStatesItems.map((s) => s.name).join(', '),
            description: '',
            states: this.updatedListStatesItems,
          };
        }
        const payload = {
          title: this.title,
          color: this.color,
          stateGroup,
          description: this.description,
        };
        this.$store.dispatch('createList', payload);
        this.$refs.addTitleAndColorForm.reset();
        this.dialog = false;
      }
    },
    resetTitleAndColorForm() {
      this.dialog = false;
      this.$refs.addTitleAndColorForm.reset();
      this.color = '#A0E9C9FF';
    },
    swatchStyle() {
      return {
        backgroundColor: this.color,
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

};
</script>
<style scoped>
#availableListStates{
  height: 100px;
  overflow: auto;
}
</style>
