<template>
  <div class="home">
     <Lists/>
  </div>
</template>

<script>
// @ is an alias to /src
import Lists from '../components/Lists.vue';

export default {
  name: 'Home',
  components: {
    Lists,
  },
};
</script>
