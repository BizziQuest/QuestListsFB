<template>
  <div class="list-item-view">
    <template>
      <v-container>
         <v-row>
          <v-col col="12" md="6">
            <v-text-field
              style="margin-bottom:20px;"
              :value="listItem.text"
              @change="listItem.text = $event"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate "
              >{{ listItem.text }}</v-text-field
            >
          </v-col>
          <v-col col="12" md="6">
            <!--v-select
              style="margin-bottom:20px;"
              :items="itemStates"
              :label="listItem.state"
              @change = "listItem.state = $event"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate "
            ></v-select-->
            <v-icon
               style="margin-bottom:20px;"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate ">
              {{listItem.state}}
            </v-icon>
          </v-col>
          {{listStates[index]}}--{{index}}
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'The list item was passed from List with more info like array of'
      + 'objects which each obj includes text and state key values',
    },
    index: {
      type: Number,
      description: 'it is the index of list item',
    },
    listStates: {
      type: Array,
      description: 'all the item and states',
    },
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    deactivate() {
      this.isOutlined = false;
    },
    activate() {
      // this.isOutlined = true;
      console.log('I am clicked', this.listStates[this.index + 1]);
      this.listItem.state = this.listStates[this.index + 1].state;
    },
  },
  computed: {
    ...mapGetters([
      'itemStates',
    ]),
  },
};
</script>

<style lang="scss" scoped></style>
