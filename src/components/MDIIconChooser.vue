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
      currentQueryString: null,
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
      this.currentQueryString = queryString;
      if (!queryString || queryString.length < 2) {
        this.iconItems = [];
        this.loading = false;
        return;
      }
      const batchSize = 400;
      const iconFinderPromises = [];
      let batchStart = 0;
      let promiseIndex = 0;
      while(batchStart < this.iconInfo.length) {
        batchStart = iconFinderPromises.length * batchSize;
        iconFinderPromises.push(this.findIcon(queryString, batchStart, batchSize, promiseIndex++));
      }
      Promise.all(iconFinderPromises).then((lists) => {
        this.iconItems = [].concat(...lists).slice(0, 25);  // vuetify is slow to assemble the UI, so we need to limit the number of items
        this.loading = false;
      })
    },
    async findIcon(queryString, batchStart, batchSize, batchNum) {
      const queryRegex = new RegExp(queryString, 'i');
      return this.iconInfo.slice(batchStart, batchStart + batchSize)
        .filter(
          (icon) => {
            if (icon.deprecated) return false;
            if (queryRegex.test(icon.title)) return true;
            if (queryRegex.test((icon?.aliases || []).join(', '))) return true;
            return false;
          }
        )
    },
  },
  mounted() {
    this.selectedIcon = this.iconInfo[0].name;
  },
};
</script>
