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
            <v-row>
              <v-col cols="12" sm="5" md="4">
                <v-text-field label="Title*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="7" md="8">
                <v-text-field label="Color*" v-model="color">
                  <template v-slot:append-outer>
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle" v-on="on" />
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
              <v-col cols="12" sm="6">
                <v-text-field label="New State*" v-model="newState"></v-text-field>
                <v-btn v-on:click="addState" class="primary">Add</v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <span>Availabe States</span>
                <div>
                  <ul v-for="item in itemStates" :key="item.state">
                    <li>{{ item }}</li>
                  </ul>
                </div>
              </v-col>
              <!--v-col cols="12" sm="6">
                <v-autocomplete :items="states" label="States" multiple></v-autocomplete>
              </v-col-->
              <v-col cols="12" sm="5">
                <v-text-field label="New Item*" v-model="newItem"></v-text-field>
              </v-col>
              <v-col cols="12" sm="5">
                <v-autocomplete :items="itemStates" label="States" multiple v-model="statesPicked"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="2">
                <v-btn v-on:click="addNewItem" class="primary" >Add</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
      <div v-for="item in itemsList" :key="item.name">
        <span> {{ item.name }} </span> --- <span>{{ item.states }}</span>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'CreateAList',
  data() {
    return {
      color: '#F0E9E9FF',
      menu: false,
      dialog: false,
      // states: ['Done', 'Not Done'],
      newState: null,
      // itemsList: [],
      newItem: null,
      statesPicked: null,
    };
  },
  methods: {
    addState() {
      // this.states.push(this.newState);
      this.$store.dispatch('addState', this.newState);
      this.newState = '';
    },
    addNewItem() {
      const item = {};
      item.name = this.newItem;
      item.states = this.statesPicked;
      this.$store.dispatch('addItem', item);
      // this.itemsList.push(item);
      this.newItem = '';
      this.statesPicked = '';
    },
  },
  computed: {
    itemStates() {
      return this.$store.getters.itemStates;
    },
    itemsList() {
      return this.$store.getters.itemsList;
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
  },
};
</script>

<style lang="scss" scoped></style>
