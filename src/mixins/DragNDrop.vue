<script>
export default {
  data() {
    return {
      numForceRedraws: 0, // used to redraw the rows when there is no changes
      $_initialY: null,
      $_rowOffset: 0,
      $_dragging: false,
    };
  },
  methods: {
    startDrag: ($event) => {
      const sourceIndex = parseInt($event.target
        .closest('[data-index]')
        .getAttribute('data-index'), 10);
      const event = $event;
      $event.target.classList.add('start-drag');
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('sourceIndex', sourceIndex);
    },
    onDrop($event) {
      const event = $event;
      const droppedItem = event.target
        .closest('.row');
      this.$nextTick(() => {
        droppedItem.classList.remove('start-drag');
        droppedItem.classList.add('end-drag');
      });
      const array = [...this.items];
      const sourceIndex = parseInt($event.dataTransfer
        .getData('sourceIndex'), 10);
      const targetIndex = parseInt($event.target
        .closest('[data-index]')
        .getAttribute('data-index'), 10);

      const orderedArray = this.$_ql_reorder(array, sourceIndex, targetIndex);
      if (orderedArray === false) {
        console.log('No motion:', array);
        $event.preventDefault();
        return;
      }
      this.items = orderedArray;
    },
    allowDrop($event) {
      $event.preventDefault();
    },
    startTouch($event) {
      const evt = $event;
      if (!$event.target.className.includes('drag-handle')) return;
      console.log('touch start', $event);
      this.$_initialY = evt.touches[0].clientY;
      console.warn('Initial Y: ', this.$_initialY);
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
        console.log('current point', $event.changedTouches[0].clientY);
        if ($event.changedTouches[0].clientY < dropZone.getBoundingClientRect().y) {
          limiter = 0;
        } else if ($event.changedTouches[0].clientY > dropZone.getBoundingClientRect().bottom) {
          limiter = 0;
        } else {
          limiter = moveY;
        }
        console.log('moveY, rowOffset', moveY, this.$_rowOffset);
        console.error('dropzone dimenstion y', dropZone.getBoundingClientRect().y);
        console.warn('LIMITER', limiter);
        row.style.cssText = `position:relative;left:0px;top:${limiter}px;`;
        this.$_dragging = true;
      }
    },
    $_ql_reorder(array, sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex || sourceIndex === targetIndex + 1) {
        console.log('No motion:', array);
        return false;
      }
      let sortedList = [];
      if (sourceIndex > targetIndex) {
        const itemsBeforeAndIncludingTarget = array.slice(0, targetIndex + 1);
        const itemsTargetToSourceNotIncludingSource = array.slice(targetIndex + 1, sourceIndex);
        const itemsAfterSource = array.slice(sourceIndex + 1);
        sortedList = itemsBeforeAndIncludingTarget.concat(
          array[sourceIndex],
          itemsTargetToSourceNotIncludingSource,
          itemsAfterSource,
        );
      } else {
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
          console.log('elem === draggedRow', elem, draggedRow, elem === draggedRow);
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
        console.log(sourceIndex, targetIndex);

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
