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
              :outlined="isOutlined"
              @click="outline"
              @blur="removeOutline"
              >{{ listItem.text }}</v-text-field
            >
          </v-col>
          <v-col col="12" md="6">
            <v-select
              style="margin-bottom:20px;"
              :items="itemStates"
              :label="listItem.state"
              @change = "listItem.state = $event"
              :outlined="isOutlined"
              @click="outline"
              @blur="removeOutline"
            ></v-select>
          </v-col>
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
      description: 'The list item was passed from List with more info like array of'+
      'objects which each obj includes text and state key values',
    },
  },
  mounted() {
    console.log(this.$store);
  },
  data: () => ({
    isOutlined: false,
  }),
  methods: {
    removeOutline() {
      this.isOutlined = false;
    },
    outline() {
      this.isOutlined = true;
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