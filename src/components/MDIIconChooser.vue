<template>
  <v-autocomplete
    label="Start typing to search for an icon"
    :items="iconItems"
    v-model="selectedIcon"
    v-model:search="search"
    :loading="loading"
    :prepend-icon="selectedIcon"
    @update:model-value="$emit('update:modelValue', $event)"
    >
    <template v-slot:item="{ props, item }">
      <!-- <div :title="item.raw.title" class="ma-2 d-inline-block">
      <v-icon v-bind="props" >{{item.raw.value}}</v-icon>
      </div> -->
      <v-list-item
        v-bind="props"
        :prepend-icon="item.raw.value"
        :title="item.raw.title"
        :subtitle="item.raw.aliases"
        clearable
      ></v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import iconInfo from '../assets/icons.json';

/** @typedef iconInfo
  * @property {string} id
  * @property {string} baseIconId
  * @property {string} name
  * @property {string} codepoint
  * @property {string[]} aliases
  * @property {string[]} tags
  * @property {string[]} styles
  * @property {string} author
  * @property {string} version
  * @property {boolean} deprecated
 */

export default {
  name: 'MDIIconChooser',

  data() {
    return {
      /**@type iconInfo[] */
      iconInfo,
      selectedIcon: null,
      loading: false,
      iconItems: [],
      search: null,
    };
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  computed: {
  },
  methods: {
    buildIconName(item) {
      const ret = this.buildIconName2(item);
      console.log('name', ret, typeof ret);
      return ret;
    },
    buildIconName2(item) {
      if (item.aliases.length < 1) return item.name;
      return `${item.name} (${item.aliases.join(', ')})`;
    },
    querySelections(queryString) {
      this.loading = true;

      if (!queryString || queryString.length < 2) {
        this.iconItems = [];
        this.loading = false;
        return;
      }
      this.iconItems = this.iconInfo
        .filter(
          (icon) => {
            if (icon.deprecated) return false;
            return icon?.title.toLowerCase().includes(queryString.toLowerCase())
                    || (icon?.aliases || []).join(', ').toLowerCase().includes(queryString.toLowerCase());
          }
        )
      this.loading = false;
    },
  },
  mounted() {
    this.selectedIcon = this.iconInfo[0].name;
  },
};
</script>
