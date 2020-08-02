<template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div class="drop-zone"
         @drop="onDrop"
         @dragover="allowDrop($event)">
      <span
        v-for="(item,index) in items"
        :key="`${item.text}${index}`"
        :data-index="index"
        @dragstart="startDrag"
      >
        <list-state :item="item"
                    draggable="true"
                    @update:item="ensureNewState(index, $event)" />
      </span>
    </div>
  </v-container>
</template>
<script>
import ListState from './ListState.vue';

export default {
  name: 'StatesEditor',
  components: {
    ListState,
  },
  props: {
    stateItems: {
      type: Array,
      default: () => [],
      description: 'The list of states we want to manage.',
    },
  },
  data() {
    return {
      items: this.stateItems,
    };
  },
  methods: {
    ensureNewState(index, state) {
      const lastStateIndex = this.items.length - 1;
      if (index === lastStateIndex) {
        if (state.text.length !== 0) {
          this.items.push({ icon: 'mdi-plus', text: 'New Item' });
        }
      }
    },
    startDrag: ($event) => {
      const sourceIndex = parseInt($event.target
        .closest('[data-index]')
        .getAttribute('data-index'), 10);
      console.log('evt index vs source index', $event, sourceIndex);
      const event = $event;
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('sourceIndex', sourceIndex);
    },
    onDrop($event) {
      // DEFINE: a pivot is a point at which a list is broken up. This method
      //         has 2 pivots: the index for the item we are moving and the target index
      // a,c,d,b,e,f => a,b,c,d,e,f
      // moving (sourceTarget): b @ 3 => b @ 1
      // dropTarget: a@0  # NOTE: droptarget comes before sourceTarget, so our first pivot is there
      // [0..dropTarget], [dropTarget..sourceTarget-1], [sourceTarget+1..end]
      // [0..droptarget] + [sourceTarget] + [dropTarget..sourcetarget-1] + [sourceTarget+1..end]

      // list.reduce([], () => {
      //   // there may be another way to reduce() this list: build a new list with the item inserted
      //   // check each item to see if the insertion is needed and insert it.
      // });

      const array = [...this.items];
      const sourceIndex = parseInt($event.dataTransfer.getData('sourceIndex'), 10);
      console.log('type of sourceIndex', sourceIndex);
      console.log('element is', document.getElementById(sourceIndex));
      const targetIndex = parseInt($event.target
        .closest('[data-index]')
        .getAttribute('data-index'), 10);
      console.log('Source Item (dragged item): ', sourceIndex, array[sourceIndex]);
      console.log('Target Item (dropped onto): ', targetIndex, array[targetIndex]);

      // console.log('type of sourceIndex', typeof sourceIndex);
      // console.log('type of targetIndex', typeof targetIndex);
      // console.log('sourceIndex === targetIndex + 1', sourceIndex === targetIndex + 1);
      if (sourceIndex === targetIndex || sourceIndex === targetIndex + 1) {
        console.log('No motion:', array);
        $event.preventDefault();
        return;
      }
      if (sourceIndex > targetIndex) {
        const itemsBeforeAndIncludingTarget = array.slice(0, targetIndex + 1);
        // console.log('itemsBeforeAndIncludingTarget', itemsBeforeAndIncludingTarget, 0, targetIndex + 1);

        const itemsTargetToSourceNotIncludingSource = array.slice(targetIndex + 1, sourceIndex);
        // console.log('itemsTargetToSourceNotIncludingSource', itemsTargetToSourceNotIncludingSource);

        const itemsAfterSource = array.slice(sourceIndex + 1);
        this.items = itemsBeforeAndIncludingTarget.concat(
          array[sourceIndex],
          itemsTargetToSourceNotIncludingSource,
          itemsAfterSource,
        );
      } else {
        const itemsBeforeAndNOTIncludingSource = array.slice(0, sourceIndex);
        console.log('itemsBeforeAndNOTIncludingSource', itemsBeforeAndNOTIncludingSource, 0, sourceIndex);

        const itemsAfterSourceToTargetIncludingTarget = array.slice(sourceIndex + 1, targetIndex + 1);
        console.log('itemsAfterSourceToTargetIncludingTarget', itemsAfterSourceToTargetIncludingTarget);

        const itemsAfterTarget = array.slice(targetIndex + 1);
        console.log('itemsAfterTarget', itemsAfterTarget);
        this.items = itemsBeforeAndNOTIncludingSource.concat(
          itemsAfterSourceToTargetIncludingTarget,
          array[sourceIndex],
          itemsAfterTarget,
        );
      }

      $event.preventDefault();
    },
    allowDrop($event) {
      $event.preventDefault();
    },
  },
};
</script>
<style scoped>
#box {
  border: 1px solid blueviolet;
  min-height: 100px;
  height: auto;
}
</style>
