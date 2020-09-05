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
              :title="listItem.state.text"
            >{{listItem.state.icon}}</v-icon>
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
import { mapGetters } from 'vuex';

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
    isNewItem: {
      type: Boolean,
      description: 'it is new item entry',
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
      this.$emit('update:text', text);
    },
    cycleIcon() {
      this.activate();
      const currentStateIcon = this.listItem.state.icon;
      const itemStatesLength = this.itemStates.length - 1;
      let stateIconIndex = this.itemStates
        .findIndex((state) => state.icon === currentStateIcon);
      if (!this.isNewItem) {
        if (stateIconIndex === itemStatesLength) {
          this.listItem.state.icon = this.itemStates[stateIconIndex - itemStatesLength].icon;
          stateIconIndex -= 1;
        } else {
          this.listItem.state.icon = this.itemStates[stateIconIndex + 1].icon;
          stateIconIndex += 1;
        }
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
