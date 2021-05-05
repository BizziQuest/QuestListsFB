<template>
  <v-color-picker flat :value="value" @input="$emit('input', $event)" />
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {};
  },
};
</script>
