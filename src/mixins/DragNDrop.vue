<script>
export default {
  data() {
    return {
      numForceRedraws: 0, // used to redraw the rows when there is no changes
      updatedRows: [null, null],
      $_initialY: null,
      $_rowOffset: 0,
      $_dragging: false,
      $_leftDragArea: false,
    };
  },
  methods: {
    startDrag($event) {
      const sourceRow = $event.target.closest('[data-index]');
      const sourceIndex = parseInt(sourceRow.getAttribute('data-index'), 10);
      const event = $event;
      $event.target.classList.add('start-drag');
      requestAnimationFrame(() => {
        $event.target.classList.add('hide-drag');
      });
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('sourceIndex', sourceIndex);
    },
    mouseLeave() {
      this.$_leftDragArea = true;
    },
    mouseEnter() {
      this.$_leftDragArea = false;
    },
    endDrag() {
      if (this.$_leftDragArea) this.numForceRedraws += 1;
    },
    onDrop($event) {
      const event = $event;
      const array = [...this.items];
      const sourceIndex = parseInt($event.dataTransfer
        .getData('sourceIndex'), 10);
      const targetIndex = parseInt($event.target
        .closest('[data-index]')
        .getAttribute('data-index'), 10);
      const droppedItem = event.target
        .closest('#drop-zone')
        .querySelector(`[data-index="${sourceIndex}"]`);
      if (!droppedItem) return;
      droppedItem.classList.remove('start-drag');
      droppedItem.classList.remove('hide-drag');
      droppedItem.classList.add('end-drag');
      const sourceKey = droppedItem
        .closest('[data-key]')
        .getAttribute('data-key');
      const targetKey = $event.target.closest('[data-key]').getAttribute('data-key');
      this.updatedRows = [sourceKey, targetKey];

      const orderedArray = this.$_ql_reorder(array, sourceIndex, targetIndex);
      if (orderedArray === false) {
        console.log('No motion:', array);
        $event.preventDefault();
        $event.stopPropagation();
        return;
      }
      this.items = orderedArray;
      this.$emit('list:updated', this.items.slice(0, -1));
      $event.preventDefault();
      $event.stopPropagation();
    },
    allowDrop($event) {
      $event.preventDefault();
    },
    startTouch($event) {
      const evt = $event;
      if (!$event.target.className.includes('drag-handle')) return;
      this.$_initialY = evt.touches[0].clientY;
      const row = $event.currentTarget.closest('[data-index]');
      this.$_rowOffset = Math.round(this.$_initialY - row.getBoundingClientRect().y);
    },
    moveTouch(evt) {
      const $event = evt;
      $event.preventDefault();
      if (!$event.target.className.includes('drag-handle')) return;
      if ($event.targetTouches.length === 1) {
        const row = $event.target.closest('[data-index]');
        const moveY = $event.changedTouches[0].clientY - this.$_initialY;
        const dropZone = document.getElementById('drop-zone');
        let limiter;
        const cYBiggerThany = $event.changedTouches[0].clientY < dropZone.getBoundingClientRect().y;
        const cYSmallerThany = $event.changedTouches[0].clientY > dropZone.getBoundingClientRect().bottom;
        if (cYBiggerThany || cYSmallerThany) {
          limiter = 0;
        } else {
          limiter = moveY;
        }
        row.style.cssText = `position:relative;left:0px;top:${limiter}px;`;
        this.$_dragging = true;
      }
    },
    $_ql_reorder(array, sourceIndex, targetIndex) {
      const arrayExcludingLast = array.slice(0, array.length - 1);
      const lastItem = array.slice(array.length - 1);
      if (targetIndex > array.length - 2 || sourceIndex === targetIndex || sourceIndex === targetIndex + 1) {
        console.log('No motion:', arrayExcludingLast);
        return false;
      }
      let sortedList = [];
      if (sourceIndex > targetIndex) {
        const itemsBeforeAndIncludingTarget = arrayExcludingLast.slice(0, targetIndex + 1);
        const itemsTargetToSourceNotIncludingSource = arrayExcludingLast.slice(targetIndex + 1, sourceIndex);
        const itemsAfterSource = arrayExcludingLast.slice(sourceIndex + 1);
        sortedList = itemsBeforeAndIncludingTarget.concat(
          arrayExcludingLast[sourceIndex],
          itemsTargetToSourceNotIncludingSource,
          itemsAfterSource,
          lastItem,
        );
      } else {
        const itemsBeforeAndNOTIncludingSource = arrayExcludingLast.slice(0, sourceIndex);
        const itemsAfterSourceToTargetIncludingTarget = arrayExcludingLast.slice(sourceIndex + 1, targetIndex + 1);
        const itemsAfterTarget = arrayExcludingLast.slice(targetIndex + 1);
        sortedList = itemsBeforeAndNOTIncludingSource.concat(
          itemsAfterSourceToTargetIncludingTarget,
          arrayExcludingLast[sourceIndex],
          itemsAfterTarget,
          lastItem,
        );
      }
      return sortedList;
    },
    endTouch($event) {
      if (!$event.target.className.includes('drag-handle')) return;
      // prevent dragging if there is not touch move action
      if (this.$_dragging) {
        const draggedRow = $event.target.closest('[data-index]');
        const draggedRowY = draggedRow.getBoundingClientRect().y;

        const elementsBefore = this.$refs.row.filter((elem) => {
          if (elem === draggedRow) {
            return false;
          }
          return draggedRowY >= elem.getBoundingClientRect().y;
        });
        const moveToElem = elementsBefore[elementsBefore.length - 1];
        if (!moveToElem) {
          this.numForceRedraws += 1;
          return;
        }

        const array = [...this.items];
        const sourceIndex = draggedRow.getAttribute('data-index');
        const targetIndex = moveToElem.getAttribute('data-index');
        const orderedArray = this.$_ql_reorder(array,
          parseInt(sourceIndex, 10),
          parseInt(targetIndex, 10));

        if (orderedArray === false) {
          this.numForceRedraws += 1;
          return;
        }
        this.items = orderedArray;
      }
    },
  },
};
</script>
