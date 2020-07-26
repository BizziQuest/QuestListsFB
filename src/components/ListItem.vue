<template>
  <div class="list-item-view">
    <template>
      <v-container>
        <v-row>
          <v-col col="12" md="6">
            <v-text-field
              style="margin-bottom:20px;"
              :value="listItem.title"
              @change="listItem.title = $event"
              @input="updateText($event)"
              :outlined="isActive"
              @click.prevent="activate"
              @blur="deactivate"
              >{{ listItem.title }}</v-text-field
            >
          </v-col>
          <v-col col="12" md="6">
            <v-select
              style="margin-bottom:20px;"
              :items="states.map( (s) => s.name )"
              :label="listItem.state || (states[0] && states[0].name)"
              :outlined="isActive"
              @click.prevent="activate"
              @blur="deactivate"
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
      description: 'List Item is an object in the form: {title, order}',
    },
    states: {
      type: Array,
      default: async () => [],
      description: 'The list of states that this item should have.',
    },
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    deactivate() {
      this.isActive = false;
      this.$emit('blur', this.listItem);
    },
    activate() {
      this.isActive = true;
    },
    updateText(text) {
      this.$emit('update:listItem', { text, state: this.listItem.state });
    },
  },
};
</script>

<style lang="scss" scoped></style>
