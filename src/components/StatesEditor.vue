<template>
  <v-container fluid>
     <v-expansion-panels style="background-color: #ccc;">
    <v-expansion-panel style="background-color: #eee;" elevation="0">
      <v-expansion-panel-header>
        Possible Item States:
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div id="drop-zone" @drop="onDrop" @dragover="allowDrop" @touchmove="moveTouch" @touchend="endTouch"
          @dragleave="mouseLeave" @dragenter="mouseEnter">
          <span v-for="(item, index) in items" :key="item.value + index" :data-index="index" :id="index" @drop="onDrop"
            @dragstart="startDrag" @dragend="endDrag" @touchstart="startTouch" class="item-row" ref="row"
            test-list-item>
            <v-row class="justify-start align-center">
              <list-state list-state-test :ref="`stateItem${index}`" :compact="compact" :item="item"
                :draggable="index !== items.length - 1" :isDraggable="index !== items.length - 1"
                @update:item="updateThisState(index, $event)" @enterPressed="focusListItem(index + 1, $event)"
                @delete:item="deleteListState(index, $event)" @blur="updateItem(index, $event)"
                :class="itemStateClasses(item, index)" />
            </v-row>
          </span>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ListState from './ListState.vue';
import DragNDrop from '../mixins/DragNDrop.vue';
import { getDocRefData } from '../firebase';

function getNextUnusedValue(unsortedItems) {
  if (!unsortedItems || unsortedItems.length < 1) return 0;
  const sortedItems = [...unsortedItems];
  sortedItems.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  const newValue = parseInt(sortedItems[sortedItems.length - 1].value, 10) + 1;
  // console.log(newValue, sortedItems);
  // const allValues = new Set(items.map((item) => item.value));
  // while (allValues.has(newValue)) {
  //   newValue += 1;
  // }
  return newValue;
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
      description: 'The default StateGroup object we want to manage. It can be a reference or an object.',
    },
    compact: {
      description: 'Whether to show a compact UI.',
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // This is the actual object we are modifying. it is our local state.
      stateGroupObject: {
        states: [],
      },
      // our internal representation that is updated, but not used for updating DOM.
      updatedStateGroup: {
        states: [],
      },
      states: this.$props.stateGroup.states,
      rowItems: [],
      addingItem: false,
    };
  },
  watch: {
    stateGroup() {
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
          value: 'new',
          isNewItem: true,
          text: '',
        }];
    },
  },
  mounted() {
    this.dereferenceStateGroup();
  },
  methods: {
    itemStateClasses(item, index) {
      return {
        changed: this.updatedRows.find((e) => e && e.localeCompare(`${item.text}${index}`) === 0),
        endDrag: this.updatedRows[0] && this.updatedRows[0].localeCompare(`${item.text}${index}`) === 0,
        startDrag: this.updatedRows[1] && this.updatedRows[1].localeCompare(`${item.text}${index}`) === 0,
      };
    },
    async dereferenceStateGroup() {
      console.log('sg:', this.stateGroup, Object.keys({ ...this.stateGroup }).length);
      if (Object.keys({ ...this.stateGroup }).length < 1) {
        console.log(this.globalPreferences);
        this.states = this.globalPreferences.defaultStateGroup.states;
        return;
      }
      if (this.stateGroup?.states) {
        this.stateGroupObject = this.stateGroup;
        return;
      }
      if (!this.stateGroup) return;
      this.stateGroupObject = await getDocRefData(this.stateGroup);
      console.log(this.stateGroupObject);
      this.states = this.stateGroupObject.states;
      this.states[this.states.length - 1].value = getNextUnusedValue(this.states);
    },
    updateItem(index, state) {
      this.updateThisState(index, state);
      this.$emit('list:updated', { ...this.stateGroupObject, ...this.updatedStateGroup });
    },
    updateThisState(index, state) {
      const states = [...(this.updatedStateGroup.states.length > 0 ? this.updatedStateGroup.states : this.states)];
      states[index] = {
        ...(states[index] || {}),
        value: state.value || getNextUnusedValue(states),
        text: state.text || states[index]?.text || '',
        icon: state.icon || states[index]?.icon || '',
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
          this.$refs[`stateItem${index + 1}`][0].value = '';
        });
      }
    },
    focusListItem(index) {
      console.debug('focusing', index);
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
  // min-height: 300px;
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
