<template>
  <div class="list-item-view">
    <template>
      <v-container>
        <v-row>
          <v-col col="12" md="6">
            <v-icon
              large
              class="listitem-icon"
              :outlined="isActive"
              @click="cycleIcon"
              @blur="deactivate"
            >{{listItem.state}}</v-icon>
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
      description: 'List Item is an object in the form: {title, state}',
    },
    states: {
      type: Array,
      default: () => [],
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
      this.$emit('update:listItem', text);
    },
    cycleIcon() {
      this.activate();
      const currentState = this.listItem.state;
      const itemStatesLength = this.itemStates.length - 1;
      let stateIndex = this.itemStates.findIndex((state) => state === currentState);
      if (stateIndex === itemStatesLength) {
        this.listItem.state = this.itemStates[stateIndex - itemStatesLength];
        stateIndex -= 1;
      } else {
        this.listItem.state = this.itemStates[stateIndex + 1];
        this.localIndex += 1;
      }
    },
  },
  computed: {
    ...mapGetters(['itemStates']),
  },
};
</script>

<style lang="scss" scoped>
.listitem-icon {
  display: inline-flex;
  margin-right: 10px;
}
.listitem-text {
  display: inline-block;
}
</style>
