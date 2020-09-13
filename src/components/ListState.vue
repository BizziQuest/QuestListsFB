<template>
  <v-row class="justify-start align-center">
    <v-icon
    v-if="isDraggable"
    class="drag-handle">drag_indicator</v-icon>
    <div class="icon-state">
      <icon-state :icon.sync="item.icon"></icon-state>
    </div>
    <v-text-field :value.sync="item.name"
                  @input="isChanging($event)"
                  @blur="updateText">
    </v-text-field>
  </v-row>
</template>
<script>
import IconState from './IconState.vue';

export default {
  props: ['item', 'isDraggable'],
  components: {
    IconState,
  },
  data() {
    return {
      text: this.item.name,
    };
  },
  methods: {
    updateText($event) {
      this.$emit('blur', { icon: this.item.icon, text: $event.target.value });
    },
    isChanging(evt) {
      this.$emit('update:item', { icon: this.item.icon, text: evt });
    },
  },
};
</script>
<style scoped lang="scss">
.list-state {
  align-items: center;
}
.icon-state {
  width: 30px;
  margin-right: 10px;
}
.drag-handle {
  padding-right: 10px;
}

</style>
