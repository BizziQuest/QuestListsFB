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
            >{{ listItem.text }}</v-text-field>
          </v-col>
          <v-col col="12" md="6">
            <v-icon
              style="margin-bottom:20px;"
              :outlined="isActive"
              @click="activate"
              @blur="deactivate"
            >{{listItem.state}}</v-icon>
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
      this.isOutlined = false;
    },
    activate() {
      this.isOutlined = true;
      const currentState = this.listItem.state;
      let stateIndex = this.itemStates.findIndex((state) => state === currentState);
      if (stateIndex === this.itemStates.length - 1) {
        this.listItem.state = this.itemStates[stateIndex - (this.itemStates.length - 1)];
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

<style lang="scss" scoped></style>
