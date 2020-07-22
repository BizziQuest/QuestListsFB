<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" class="primary">
      <template v-slot:activator="{ on }">
        <v-list-item link v-on="on">
          <v-list-item-action>
            <v-icon>add</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">create a list</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create A List</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" @submit.prevent>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Title*"
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
            <v-container fluid>
            <span>Possible Item States:</span>
            <span v-for="(item,index) in itemStates" :key="item.state">
              <list-state :item="item" @update:item="ensureNewState(index,$event)"></list-state>
            </span>
            </v-container>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="resetTheForms">Close</v-btn>
          <v-btn color="blue darken-1" text @click="createAList">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import ListState from './ListState.vue';

export default {
  name: 'CreateAList',
  components: {
    ListState,
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
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => (v && v.length > 5) || 'Title must be longer than 5 characters',
      ],
      colorPickerRules: [
        (v) => !!v || 'Color is required',
        (v) => /^#[0-9A-F]{8}$/i.test(v) || 'Color Format Must be #FFFFFF',
      ],
    };
  },
  methods: {
    createAList() {
      if (this.$refs.form.validate()) {
        const payload = {};
        payload.title = this.title;
        payload.bgColor = this.color;
        this.$store.dispatch('createAList', payload);
        this.$refs.form.reset();
        this.dialog = false;
      }
    },
    resetTheForms() {
      this.dialog = false;
      this.$refs.form.reset();
      this.color = '#A0E9C9FF';
      this.$store.dispatch('resetStates');
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
    ...mapGetters(['itemStates']),
  },

};
</script>
