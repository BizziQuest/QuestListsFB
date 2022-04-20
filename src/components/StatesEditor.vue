<template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div id="drop-zone" @drop="onDrop" @dragover="allowDrop" @touchmove="moveTouch" @touchend="endTouch"
      @dragleave="mouseLeave" @dragenter="mouseEnter">
      <span v-for="(item, index) in items" :key="`${item.text}${index}${numForceRedraws}`" :data-index="index"
        :id="index" @drop="onDrop" @dragstart="startDrag" @dragend="endDrag" @touchstart="startTouch" class="item-row"
        ref="row" :data-key="`${item.text}${index}${numForceRedraws}`" test-list-item>
        <v-row class="justify-start align-center">
          <list-state list-state-test :ref="`stateItem${index}`" :item="item" :draggable="index !== states.length - 1"
            :isDraggable="index !== states.length - 1" @update:item="updateThisState(index, $event)"
            @enterPressed="focusListItem(index + 1, $event)"
            @delete:item="deleteListState(index, $event)" @blur="updateItem(index, $event)" :class="{
              changed: updatedRows.find(e => e && e.localeCompare(`${item.text}${index}${numForceRedraws}`) === 0),
              endDrag: updatedRows[0] && updatedRows[0].localeCompare(`${item.text}${index}${numForceRedraws}`) === 0,
              startDrag: updatedRows[1] && updatedRows[1].localeCompare(`${item.text}${index}${numForceRedraws}`) === 0
            }" />
        </v-row>
      </span>
    </div>
  </v-container>
</template>

<script>
import ListState from './ListState.vue';
import DragNDrop from '../mixins/DragNDrop.vue';
import { getDocRefData } from '../firebase';

function getNextUnusedValue(items) {
  if (!items || items.length < 1) return '';
  let newValue = items.length;
  const allValues = new Set(items.map((item) => item.value));
  while (allValues.has(newValue)) {
    newValue += 1;
  }
  return newValue.toString();
}

export default {
  name: 'StatesEditor',
  mixins: [DragNDrop],
  components: {
    ListState,
  },
  props: {
    stateGroup: {
      type: Object,
      default: () => ({}),
      description: 'The list of states we want to manage.',
    },
  },
  data() {
    return {
      stateGroupObject: {
        states: [],
      },
      states: this.$props.stateGroup.states,
      rowItems: [],
    };
  },
  watch: {
    stateGroup() {
      this.dereferenceStateGroup();
    },
  },
  computed: {
    items() {
      return [
        ...(this.stateGroupObject?.states || []),
        {
          icon: 'mdi-plus',
          value: getNextUnusedValue(this.stateGroupObject?.states),
          isNewItem: true,
        }];
    },
  },
  mounted() {
    this.dereferenceStateGroup();
  },
  methods: {
    async dereferenceStateGroup() {
      if (this.stateGroup?.states) this.stateGroupObject = this.stateGroup;
      this.stateGroupObject = await getDocRefData(this.stateGroup);
      console.log(this.stateGroupObject);
      this.states = this.stateGroupObject.states;
      this.states[this.items.length - 1].value = getNextUnusedValue(this.stateGroupObject.states);
    },
    updateItem(index, state) {
      this.updateThisState(index, state);
      this.$emit('list:updated', this.stateGroupObject);
    },
    updateThisState(index, state) {
      const states = [...this.stateGroupObject?.states];
      if (!states[index]) states[index] = {};
      states[index].text = state.text;
      if (state?.icon) states[index].icon = state.icon;
      this.stateGroupObject = { ...this.stateGroupObject, states };
      this.$nextTick(() => this.focusListItem(index));
    },
    focusListItem(index) {
      const listItemRef = this.$refs[`stateItem${index}`];
      if (listItemRef?.length > 0) {
        listItemRef[0].$refs.input.focus(); // this will trigger blur(), which will save the items
      }
    },

    deleteListState(index) {
      const newItems = [...this.states];
      this.states = newItems.filter((_item, idx) => idx !== index);
    },
  },
};
</script>
<style lang="scss" scoped>
#drop-zone {
  min-height: 300px;
  min-width: 200px;
  width: 100%;
  height: auto;
  margin: 0px;
  padding: 0;

  .row {
    margin: 0px;
  }
}

.hide-drag {
  transform: translateX(-9999px);
}

.start-drag {
  // opacity: 0.8;
  border: 1px dashed red;
}

.changed {
  background-color: #222;
}

.startDrag {
  border: 5px solid #00ffff;
}

.endDrag {
  border: 5px solid #00ff00;
}

.end-drag {
  opacity: 1;
  border: 1px solid blue;
}
</style>
