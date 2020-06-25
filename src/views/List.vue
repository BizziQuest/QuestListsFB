<template>
  <div>
    <h1>List</h1>
    <p>{{list}}</p>
  </div>
</template>
<script>
export default {
  name: 'List',
  props: ['title'],
  computed: {
    list() {
      return this.$store.getters.list(this.title);
    },
  },
};
</script>
