<template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div   @drop="onDrop($event)"
          @dragover="allowDrop($event)">
          <div id="box">
          </div>
         <span
          v-for="(item,index) in items"
          :key="item.state"
          @dragstart="startDrag($event, $event.target.id)"
        >
          <list-state
            :id="index"
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
      const lastStateIndex = this.itemStates.length - 1;
      if (index === lastStateIndex) {
        if (state.length !== 0) {
          this.itemStates.push({ icon: 'mdi-plus', text: 'New Item' });
        }
      }
    },
    startDrag: (evt, sourceIndex) => {
      // debugger;
      // console.log('currentTarget', evt.currentTarget);
      // not for sam
      // event.target returns the node that was targeted by the function
      // index is too confusing cuz during drag and drop will be changed.
      console.log('eve traget', evt.target.id);
      console.log('start darg event', evt, sourceIndex);
      const event = evt;
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('sourceIndex', sourceIndex);
    },
    onDrop($event, targetIndex) {
      console.log('event target', $event.target);
      console.log('event dataTransefer data', $event.dataTransfer);
      const sourceIndex = $event.dataTransfer.getData('sourceIndex');
      console.log('element is', document.getElementById(sourceIndex));
      console.log('I am on drop', $event, targetIndex);
      console.log('drop target event parent elem is', $event.target.parentNode);
      const targetParentId = $event.target.parentNode.id;
      console.log('sourceIndex', sourceIndex);
      console.log('targetIndex', targetParentId);
      console.log('start', this.stateItems[sourceIndex], this.stateItems[targetParentId]);
      let temp = null;
      temp = this.stateItems[sourceIndex];
      this.stateItems[sourceIndex] = this.stateItems[targetParentId];
      this.stateItems[targetParentId] = temp;
      console.log('result', this.stateItems[sourceIndex], this.stateItems[targetParentId]);
      // $event.target.appendChild(document.getElementById(sourceIndex));
      // move the IDs
      // const newArray = [...this.stateItems];
      // const itemsUntilSourceIndex = newArray.slice(0, sourceIndex);
      // const itemsBetweenSourceAndTarget = newArray.slice(sourceIndex, targetIndex);
      // const sourceItem = [newArray[sourceIndex]];
      // const rest = newArray.slice(targetIndex);

      // const resultArray = itemsUntilSourceIndex.concat(itemsBetweenSourceAndTarget, sourceItem, rest);
      // console.log('NEW ARRY: ', JSON.stringify(resultArray));
      // this.items = resultArray;
      const node = document.createElement('span');
      const child = document.getElementById(sourceIndex);
      console.log('child is', child);
      node.appendChild(child);
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
