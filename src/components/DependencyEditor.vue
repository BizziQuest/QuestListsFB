<template>
  <div>
    <!-- <v-text-field label="Dependency" :model-value="dependency" @update:modelValue="$emit('update:dependency', $event)"></v-text-field> -->
    <v-autocomplete
      v-model="equation"
      v-model:search="equationAutocomplete"
      :loading="loading"
      :items="equationSuggestions"
      item-title="title"
      item-value="value"
      class="mx-4"
      density="comfortable"
      hide-no-data
      hide-details
      label="Dependency. Start typing to search for a list or item."
      @input="findNextAutocomplete"
    ></v-autocomplete>
    <small>This list will only show if the dependency above are met. The format is
      <code>&lt;list_name&gt;.&lt;item_name&gt; &lt;operator&gt; &lt;value&gt;</code>.</small>
  </div>
</template>

<script>
import { algolia, algoliaIndex } from '../algolia.js'

export default {
  name: 'DependencyEditor',
  props: {
    dependency: {
      type: String,
      default: '',
      description: 'The dependency to edit.',
    },
  },
  data() {
    return {
      equationAutocomplete: '',
      equation: '',
      loading: false,
      equationSuggestions: [],
      algoliaSearchClient: algolia
    };
  },
  mount() {
    this.equation = this.dependency;
  },
  watch: {
    // equationAutocomplete(val) {
    //   this.findNextAutocomplete(val);
    // },
  },
  methods: {
    findNextAutocomplete($event) {
      const equation = $event.target.value;
      const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
      const lastEquation = equations.at(-1);
      const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
      const [listName, itemName] = item.split('.');
      const equationSoFar = "";  // this should be filled in
      if(stateValue) return this.getSuggestionsForWord(stateValue, 'states', equation);
      if(itemName) return this.getSuggestionsForWord(itemName, 'items', equation);
      return this.getSuggestionsForWord(listName, 'title', equation);
    },
    async getSuggestionsForWord(word, field, equation) {
      // we need to pass in the equation, up to this part.
      console.log(word, field, text);
      const suggestions = await algoliaIndex.search(`${field}:${word}`, {
        hitsPerPage: 10,
      });
      console.log('suggestions', suggestions, suggestions.hits.length);

      this.equationSuggestions = suggestions.hits.map(hit => ({title: `${equation}"${hit.title}"`}));
    },
  },
};
</script>

<style scoped></style>
