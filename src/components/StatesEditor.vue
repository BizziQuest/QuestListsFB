  <template>
  <v-container fluid>
    <span>Possible Item States:</span>
    <div
      id="drop-zone"
      @drop="onDrop"
      @dragover="allowDrop"
      @touchmove="moveTouch"
      @touchend="endTouch"
    >
      <span
        v-for="(item,index) in items"
        :key="`${item.text}${index}${numForceRedraws}`"
        :data-index="index"
        :id="index"
        @dragstart="startDrag"
        @touchstart="startTouch"
        class="item-row"
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
  width: 275px;
  height: auto;
  margin: 0;
  padding: 0;
}
.start-drag {
  opacity: 0.1;
  border: 11px solid red;
}
.end-drag {
  opacity: 1;
  border: 11px solid blue;
}
</style>
