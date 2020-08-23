<template>
  <v-row class="justify-start align-center">
    <v-icon class="drag-handle">drag_indicator</v-icon>
    <div id="icon-state">
      <icon-state :passedIcon="item.icon" @update:icon="choosenIcon($event)" class="mr-2 ml-2"></icon-state>
    </div>
    <v-text-field :value="item.text" @input="isChanging($event)"></v-text-field>
  </v-row>
</template>
<script>
import IconState from './IconState.vue';

export default {
  props: ['item'],
  components: {
    IconState,
  },
  data() {
    return {
      icon: this.item,
    };
  },
  methods: {
    isChanging() {
      this.$emit('update:item', { icon: this.item.icon, text: this.item.text });
    },
    choosenIcon(newIcon) {
      this.icon = newIcon;
    },
  },
};
</script>
<style scoped lang="scss">
.list-state {
  align-items: center;
}
#icon-state {
  width: 42px;;
  border: 1px solid green;
  margin: 2px;
}
.drag-handle {
  border: 1px solid blanchedalmond;
  padding: 10px;
  margin: 10px;
}

</style>
