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
            >{{listItem.state.icon}}</v-icon>
            <v-text-field
              class="listitem-text"
              :value="listItem.state.text"
              @change="listItem.state.text = $event"
              @input="updateText($event)"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate"
            >{{ listItem.state.text }}</v-text-field>
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
      description: 'an obj includes text and state key values',
    },
    listStates: {
      type: Array,
      description: 'all the item and states',
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    deactivate() {
      this.isActive = false;
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
      let stateIconIndex = this.itemStates.findIndex((state) => state.icon === currentStateIcon);
      if (stateIconIndex === itemStatesLength) {
        this.listItem.state.icon = this.itemStates[stateIconIndex - itemStatesLength].icon;
        stateIconIndex -= 1;
      } else {
        this.listItem.state.icon = this.itemStates[stateIconIndex + 1].icon;
        stateIconIndex += 1;
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
