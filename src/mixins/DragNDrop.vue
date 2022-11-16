<script>
export default {
  data() {
    return {
      numForceRedraws: 0, // used to redraw the rows when there are no changes
      updatedRows: [null, null],
      $_initialY: null,
      $_rowOffset: 0,
      $_dragging: false,
      $_leftDragArea: false,
      dnd_items: []
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
    mouseLeave($event) {
      this.$_leftDragArea = true;
      $event.target.querySelector('.start-drag')?.classList?.remove('start-drag');
      $event.target.querySelector('.end-drag')?.classList?.remove('end-drag');
      $event.target.querySelector('.hide-drag')?.classList?.remove('hide-drag');
    },
    mouseEnter() {
      this.$_leftDragArea = false;
    },
    endDrag($event) {
      if (this.$_leftDragArea) this.numForceRedraws += 1;
    },
    onDrop($event) {
      const event = $event;
      const array = [...this.dnd_items];
      const sourceIndex = parseInt(
        $event.dataTransfer.getData('sourceIndex'), 10
      );

      const targetElement = $event.target.closest('[data-index]');
      if (!targetElement) {
        $event.target.classList.remove('start-drag');
        $event.target.classList.remove('end-drag');
        $event.target.classList.remove('hide-drag');
        return;
      }

      let targetIndex = 0;
      if(targetElement.getAttribute('data-index') === '-1')
        targetIndex = array.length - 1;
      else
        targetIndex = parseInt(targetElement.getAttribute('data-index'), 10);

        const droppedItem = event.target
        .closest('#drop-zone')
        .querySelector(`[data-index="${sourceIndex}"]`);
      if (!droppedItem) return;
      droppedItem.classList.remove('start-drag');
      droppedItem.classList.remove('hide-drag');
      droppedItem.classList.add('end-drag');

      const orderedArray = this.$_ql_reorder(array, sourceIndex, targetIndex);
      if (orderedArray === false) {
        $event.preventDefault();
        $event.stopPropagation();
        return;
      }
      this.dnd_items = [...orderedArray];
      this.$emit('list:updated', this.dnd_items.slice(0, -1));
      $event.preventDefault();
      $event.stopPropagation();
    },
    allowDrop($event) {
      $event.preventDefault();
      // debugger;
      $event.target.querySelector('.list-state')?.classList?.add('start-drag');
      $event.target.querySelector('.list-state')?.classList?.add('hide-drag');

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
      if (targetIndex > array.length - 1 || sourceIndex === targetIndex) {
        return false;
      }
      let sortedList = [];
      if (sourceIndex > targetIndex) {  // moving an item up in the list
        const itemsBeforeAndIncludingTarget = array.slice(0, targetIndex + 1);
        const itemsTargetToSourceNotIncludingSource = array.slice(targetIndex + 1, sourceIndex);
        const itemsAfterSource = array.slice(sourceIndex + 1);
        sortedList = itemsBeforeAndIncludingTarget.concat(
          array[sourceIndex],
          itemsTargetToSourceNotIncludingSource,
          itemsAfterSource,
        );
      } else { // moving an item down in the list
        const itemsBeforeAndNOTIncludingSource = array.slice(0, sourceIndex);
        const itemsAfterSourceToTargetIncludingTarget = array.slice(sourceIndex + 1, targetIndex + 1);
        const itemsAfterTarget = array.slice(targetIndex + 1);
        sortedList = itemsBeforeAndNOTIncludingSource.concat(
          itemsAfterSourceToTargetIncludingTarget,
          array[sourceIndex],
          itemsAfterTarget,
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

        const array = [...this.dnd_items];
        const sourceIndex = draggedRow.getAttribute('data-index');
        const targetIndex = moveToElem.getAttribute('data-index');
        const orderedArray = this.$_ql_reorder(
          array,
          parseInt(sourceIndex, 10),
          parseInt(targetIndex, 10),
        );

        if (orderedArray === false) {
          this.numForceRedraws += 1;
          return;
        }
        this.dnd_items = orderedArray;
      }
    },
  },
};
</script>
