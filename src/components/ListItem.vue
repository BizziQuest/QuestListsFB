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
            <v-select
              style="margin-bottom:20px;"
              :items="states"
              :label="listItem.state"
              @change = "listItem.state = $event"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate "
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'The list item was passed from List with more info like array of'
      + 'objects which each obj includes text and state key values',
    },
    states: {
      type: Array,
      default: () => (['Done', 'Not Done']),
      description: 'The list of states that this item should have.',
    },
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    deactivate () {
      this.isOutlined = false;
    },
    activate() {
      this.isOutlined = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
