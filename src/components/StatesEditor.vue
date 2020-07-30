<template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div @drop="onDrop"
         @dragover="allowDrop($event)">
         <span
          v-for="(item,index) in items"
          :key="`${item.text}${index}`"
          :data-index="index"
          @dragstart="startDrag($event, $event.target.id)"
        >
          <list-state
            :item="item"
            draggable="true"
            @update:item="ensureNewState(index, $event)"
          />
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
      debugger;
      const lastStateIndex = this.items.length - 1;
      if (index === lastStateIndex) {
        if (state.text.length !== 0) {
          this.items.push({ icon: 'mdi-plus', text: 'New Item' });
        }
      }
    },
    startDrag: (evt, sourceIndex) => {
      // debugger;
      // console.log('currentTarget', evt.currentTarget);
      // note for sam
      // event.target returns the node that was targeted by the function
      // index is too confusing cuz during drag and drop will be changed.
      console.log('eve traget', evt.target.id);
      console.log('start darg event', evt, sourceIndex);
      const event = evt;
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('sourceIndex', sourceIndex);
    },
    onDrop($event) {
      // debugger;
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

      console.log('event target', $event.target);
      console.log('event dataTransefer data', $event.dataTransfer);
      const sourceIndex = $event.dataTransfer.getData('sourceIndex');
      console.log('element is', document.getElementById(sourceIndex));
      // console.log('drop target event parent elem is', $event.target.parentNode);
      const targetParentId = $event.target.closest('[data-index]').getAttribute('data-index');
      console.log('sourceIndex', sourceIndex);
      console.log('targetIndex', targetParentId);
      console.log('start', this.stateItems[sourceIndex], this.stateItems[targetParentId]);
      // const newStateItems = [...this.items];
      // const temp = newStateItems[sourceIndex];
      // newStateItems[sourceIndex] = newStateItems[targetParentId];
      // newStateItems[targetParentId] = temp;
      // console.log('result', newStateItems);
      // this.items = newStateItems;
      // $event.target.appendChild(document.getElementById(sourceIndex));
      // move the IDs
      // debugger;
      let array = [...this.stateItems];
      const itemsAfterSource = array.slice(sourceIndex + 1, array.length);
      console.log('itemsAfterSouce', itemsAfterSource);

      const itemsTargetToSource = array.slice(targetParentId, sourceIndex);
      console.log('itemsTargetToSource', itemsTargetToSource);

      // if souceIndex is bigger than targetIndex
      array = array.slice(0, targetParentId)
       + array[sourceIndex]
       + itemsTargetToSource
       + itemsAfterSource;
      this.items = array;
      // const itemsUntilSourceIndex = newArray.slice(0, sourceIndex);
      // const itemsBetweenSourceAndTarget = newArray.slice(sourceIndex, targetIndex);
      // const sourceItem = [newArray[sourceIndex]];
      // const rest = newArray.slice(targetIndex);

      // const resultArray = itemsUntilSourceIndex.concat(itemsBetweenSourceAndTarget, sourceItem, rest);
      // console.log('NEW ARRY: ', JSON.stringify(resultArray));
      // this.items = resultArray;
      // const node = document.createElement('span');
      // const child = document.getElementById(sourceIndex);
      // console.log('child is', child);
      // node.appendChild(child);
      // document.getElementById('box').appendChild(node);
      // document.getElementById(targetParentId).appendChild(node);

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
