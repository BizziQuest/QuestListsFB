<template>
  <v-container fluid >
    <v-expansion-panels>
      <v-expansion-panel
        elevation="0"
        test-expander-header
        value="1"
      >
        <v-expansion-panel-title>
          Possible Item States:
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            id="drop-zone"
          >
            <v-row
              v-for="(item, index) in items"
              :id="index"
              :key="`${item.text}${index}`"
              :ref="`row${index}`"
              :data-index="item.isNewItem ? -1 : index"
              :draggable="index !== items.length - 1"
              class="item-row ma-0 px-2"
              test-list-item
              @drop.prevent="onDrop"
              @dragstart="startDrag"
              @dragenter="onDragEnter"
              @dragleave="onDragLeave"
              @dragover.prevent="null"
              @dragend="endDrag"
            >
                <list-state
                  :ref="`stateItem${index}`"
                  list-state-test
                  class="mt-1"
                  :compact="compact"
                  :item="item"
                  @selectDragRow="setSelectedRow(index)"
                  @endSelectDragRow="setSelectedRow(null)"
                  :is-draggable="index !== items.length - 1"
                  :class="itemStateClasses(item, index)"
                  @update:item="updateThisState(index, $event)"
                  @enterPressed="focusListItem(index + 1, $event)"
                  @delete:item="deleteListState(index, $event)"
                  @blur="updateItem(index, $event)"
                />
            </v-row>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ListState from './ListState.vue';
// import DragNDrop from '../mixins/DragNDrop.vue';
import { getDocRefData } from '../firebase';
import { useTheme } from 'vuetify';
function getNextUnusedValue(unsortedItems) {
  // if (!unsortedItems || unsortedItems.length < 1) return 0;
  let highestValue = 0;
  (unsortedItems || []).forEach(({ value }) => {
    const intValue = parseInt(value, 10);
    if (intValue > highestValue) highestValue = intValue;
  });
  return highestValue + 1;
}

export default {
  name: 'StatesEditor',
  components: {
    ListState,
  },
  // mixins: [DragNDrop],
  props: {
    stateGroup: {
      type: Object,
      default: () => ({}),
      description: 'The default StateGroup object we want to manage. It can be a reference or an object.',
    },
    compact: {
      description: 'Whether to show a compact UI.',
      type: Boolean,
      default: false,
    },
    reset: {
      type: Number,
      default: 0,
      description: 'Increment to reset the form.',
    },
  },
  data() {
    return {
      // This is the actual object we are modifying. it is our local state.
      stateGroupObject: {
        states: [],
      },
      selectedRow: null,
      // our internal representation that is updated, but not used for updating DOM.
      updatedStateGroup: {
        states: [],
      },
      states: this.$props.stateGroup.states,
      rowItems: [],
      addingItem: false,
      deletedValues: [],
      theme: useTheme(),
      updatedRows: [],
    };
  },
  watch: {
    stateGroup() {
      this.dereferenceStateGroup();
    },
    dnd_items(val) {
      this.states = val;
    },
    states(val) {
      this.dnd_items = val;
    },
    globalPreferences() {
      this.dereferenceStateGroup();
    },
  },
  computed: {
    ...mapState(['globalPreferences']),
    items() {
      return [
        ...(this.states || []),
        {
          icon: 'mdi-plus',
          value: -1,
          isNewItem: true,
          text: '',
        }];
    },
  },
  mounted() {
    this.dereferenceStateGroup();
  },
  methods: {
    setSelectedRow(index){
      if(index === null || index < 0) {
        this.selectedRow = null;
        return;
      }
      // console.log('selected:', this.$refs[`row${index}`][0].$el);
      this.selectedRow = this.$refs[`row${index}`][0].$el;
    },
    startDrag(event) {
      const index = event.target.getAttribute('data-index');
      const curRow = this.selectedRow;
      if (event.target === this.selectedRow) {
        event.dataTransfer.setData('text/plain', index);
      } else {
        event.preventDefault();
      }
      const current = this.$refs[`row${index}`][0].$el;
      for (let idx = 0; idx < this.states.length; idx++) {
        const otherRow = this.$refs[`row${idx}`][0].$el;
        if (otherRow != current) {
          otherRow.closest('.item-row').classList.add("hint");
        }
      }
    },
    endDrag() {
      for (let idx = 0; idx < this.states.length; idx++) {
        const otherRow = this.$refs[`row${idx}`][0].$el;
        if (otherRow != this.selectedRow) {
          const item = otherRow.closest('.item-row');
          item.classList.remove("hint");
          item.classList.remove("active");
        }
      }
      this.selectedRow = null;
    },
    onDrop(event) {
      const dragItem = this.selectedRow;
      const dropItem = event.target.closest('.item-row');

      if (dragItem != dropItem) {
        let currentpos = parseInt(dragItem.getAttribute('data-index')),
            droppedpos = parseInt(dropItem.getAttribute('data-index'));
        if(droppedpos < 0) return;
        // we have the html moved, but not the items reordered
        const currentStates = [...this.states];
        if (currentpos > droppedpos) { // we are moving an item up, so insert dragItem before dropitem
          // move currentStates[currentpos] to currentStates[droppedpos]
          const itemsBeforeDropped = currentStates.slice(0, droppedpos);
          const itemsBetween = currentStates.slice(droppedpos, currentpos);
          const endItems = currentStates.slice(currentpos + 1);
          this.states = [...itemsBeforeDropped, currentStates[currentpos],...itemsBetween, ...endItems]
          // dropItem.parentNode.insertBefore(dragItem, dropItem.nextSibling);
        } else { // moving down. insert dragItem after dropItem
          const itemsBeforeCurrent = currentStates.slice(0,currentpos);
          const itemsBetween = currentStates.slice(currentpos+1, droppedpos+1);
          const endItems = currentStates.slice(droppedpos+1);
          this.states = [...itemsBeforeCurrent,...itemsBetween, currentStates[currentpos], ...endItems]
          // dropItem.parentNode.insertBefore(dragItem, dropItem);
        }
      }
      this.selectedRow = null;
    },
    onDragEnter(event) {
      const elementBelow = event.target.closest('.item-row');
      const belowPos = parseInt(elementBelow.getAttribute('data-index'));
      if (elementBelow != this.selectedRow && belowPos >= 0) {
        elementBelow.classList.add("active");
      }
    },
    onDragLeave(event) {
      const elementBelow = event.target.closest('.item-row');
      elementBelow.classList.remove("active");
    },
    itemStateClasses(item, index) {
      if (!this.updatedRows) return {};
      return {
        changed: this.updatedRows.find((e) => e && e.localeCompare(`${item.text}${index}`) === 0),
        endDrag: this.updatedRows[0] && this.updatedRows[0].localeCompare(`${item.text}${index}`) === 0,
        startDrag: this.updatedRows[1] && this.updatedRows[1].localeCompare(`${item.text}${index}`) === 0,
      };
    },
    async dereferenceStateGroup() {
      if (Object.keys({ ...this.stateGroup }).length < 1) {
        this.states = this.globalPreferences.defaultStateGroup.states;
        return;
      }
      if (this.stateGroup?.states) {
        this.stateGroupObject = this.stateGroup;
        return;
      }
      if (!this.stateGroup) return;
      this.stateGroupObject = await getDocRefData(this.stateGroup);
      this.states = this.stateGroupObject.states;
      // this.states[this.states.length - 1].value = getNextUnusedValue(this.states);
    },
    updateItem(index, state) {
      if(state.text === '' && state.icon === 'mdi-plus') return;
      this.states = this.updateThisState(index, state);
      const newObject = { ...this.stateGroupObject, ...this.updatedStateGroup };
      // newObject.states = [...newObject.states];  // reassign these to get rid of the proxy which interferes with firebase
      this.$emit('list:updated', newObject);
    },
    updateThisState(index, state) {
      const states = [...(this.updatedStateGroup.states.length > 0 ? this.updatedStateGroup.states : this.states)];
      states[index] = {
        ...(states[index] || {}),
        value: (state?.value || -1) >= 0 ? state.value : getNextUnusedValue(states),
        text: state.text || states[index]?.text || '',
        icon: state.icon || states[index]?.icon || '',
        order: state.order || states[index]?.order || index,
        color: state.color || states[index]?.color || undefined,
      };
      this.updatedStateGroup = { ...this.stateGroupObject, ...this.updatedStateGroup, states };
      if (index === this.states.length) {
        if (this.addingItem) { // when we update the states, we reflow the UI, which blurs the items, etc...
          this.addingItem = false;
          return;
        }
        this.addingItem = true;
        this.stateGroupObject.states = states;
        this.states = states;
        this.focusListItem(index);
        this.$nextTick(() => {
          this.focusListItem(index);
          this.addingItem = false;
        });
      }
      return states;
    },
    focusListItem(index) {
      const listItemRef = this.$refs[`stateItem${index}`];
      if (listItemRef?.length > 0) {
        listItemRef[0].$refs.input.focus(); // this will trigger blur(), which will save the items
      }
    },
    deleteListState(index) {
      this.deletedValues.push(this.states[index].value);
      const newItems = [...this.states];
      this.states = newItems.filter((_item, idx) => idx !== index);
      this.updatedStateGroup = { ...this.updatedStateGroup, states: this.states };
      this.stateGroupObject = { ...this.stateGroupObject, states: this.states };
      this.$emit('list:updated', {
        ...this.stateGroupObject,
        ...this.updatedStateGroup,
        deletedValues: this.deletedValues,
      });
    },
  },
};
</script>
<style scoped>
#drop-zone {
  /* min-height: 300px;*/
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
.hint {
  border: #990000 solid 2px;
}
.start-drag {
  /* opacity: 0.8;*/
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
.item-row.active {
  background-color: #666;
}
</style>
