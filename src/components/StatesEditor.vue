  <template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div
      id="drop-zone"
      @drop="onDrop"
      @dragover="allowDrop"
      @touchmove="moveTouch"
      @touchend="endTouch"
      @dragleave="mouseLeave"
      @dragenter="mouseEnter"
    >
      <span
        v-for="(item,index) in items"
        :key="`${item.text}${index}${numForceRedraws}`"
        :data-index="index"
        :id="index"
        @drop="onDrop"
        @dragstart="startDrag"
        @dragend="endDrag"
        @touchstart="startTouch"
        class="item-row"
        ref = "row"
        :data-key="`${item.text}${index}${numForceRedraws}`"
      >
        <list-state :item="item"
                    :draggable="index !== items.length - 1"
                    :isDraggable="index !== items.length - 1"
                    @update:item="ensureNewState(index, $event)"
                    @blur="updateItem(index, $event)"
                    :class="{
                      changed: updatedRows.find(
                        (e) => e && e.localeCompare(`${item.text}${index}${numForceRedraws}`) === 0),
                      endDrag: updatedRows[0] &&
                        updatedRows[0].localeCompare(`${item.text}${index}${numForceRedraws}`) === 0,
                      startDrag: updatedRows[1] &&
                        updatedRows[1].localeCompare(`${item.text}${index}${numForceRedraws}`) === 0,
                    }"
                    />
      </span>
    </div>
  </v-container>
</template>
<script>
import ListState from './ListState.vue';
import DragNDrop from '../mixins/DragNDrop.vue';

export default {
  name: 'StatesEditor',
  mixins: [DragNDrop],
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
      rowItems: [],
    };
  },

  methods: {
    updateItem(index, state) {
      this.items[index].text = state.text;
      this.$emit('list:updated', this.items.slice(0, -1));
    },
    ensureNewState(index, state) {
      const lastStateIndex = this.items.length - 1;
      if (index === lastStateIndex) {
        if (state.text.length !== 0) {
          this.items.push({ icon: 'mdi-plus', text: 'New Item' });
        }
      }
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
  transform:translateX(-9999px);
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
