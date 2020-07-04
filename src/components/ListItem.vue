<template>
  <div>
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
              @blur="handleBlur"
              >{{ listItem.text }}</v-text-field
            >
          </v-col>
          <v-col col="12" md="6">
            <v-select
              style="margin-bottom:20px;"
              :items="allItemsStates"
              :label="listItem.state"
              @change = "listItem.state = $event"
              :outlined="isOutlined"
              @click="outline"
              @blur="handleBlur"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'The list item',
    },
  },
  data: () => ({
    isOutlined: false,
  }),
  methods: {
    handleBlur() {
      this.isOutlined = false;
    },
    outline() {
      this.isOutlined = true;
    },
  },
  computed: {
    allItemsStates() {
      return this.$store.getters.itemStates;
    },
  },
};
</script>

<style lang="scss" scoped></style>
