<template>
  <v-row class="justify-start align-center">
    <v-icon>drag_indicator</v-icon>
    <icon-state :item="item" class="mr-2 ml-2"></icon-state>
    <v-text-field :value="item"></v-text-field>
  </v-row>
</template>
<script>
import IconState from './IconState.vue';

export default {
  props: ['item'],
  components: {
    IconState,
  },
};
</script>
<style lang="css">
.list-state {
  align-items: center;
}
/*#this_row{
    display: flex;
    flex-wrap: wrap;
    flex: none;
    margin-right: 0px;
    margin-left: 0px;
}*/
</style>
