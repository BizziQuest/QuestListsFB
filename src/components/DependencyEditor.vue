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
      <code>"&lt;list_name&gt;"."&lt;item_name&gt;" &lt;operator&gt; "&lt;value&gt;"</code>.
      Quotes are optional, for clarification, and can be single or double-quotes</small>
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
      const equationRegEx = /(?<line>(?<equation>(?<listNameQt>[\"\']?)(?<listName>.*?)\k<listNameQt>\.(?<itemNameQt>[\"\']?)(?<itemName>\w.*?)\k<itemNameQt>\s*(?<operator>[=!><]=?)\s*(?<stateValueQt>[\"\']?)(?<stateValue>\w.*?)\k<stateValueQt>(\s+(?<conjunction>and|or)\s+)?)+?)/ig;
      const matches = [equationRegEx.exec($event.target.value)];
      let match = null;
      while ((match = equationRegEx.exec($event.target.value)) != null) {
        matches.push(match);
      }
      console.log('matches', matches.map(m => m.groups));
      // matches now contains all the equations
      const equation = $event.target.value;
      const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
      const lastEquation = equations.at(-1);
      const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
      const [listName, itemName] = item.split('.');
      const equationSoFar = "";  // this should be filled in
      if(stateValue) return this.getSuggestionsForWord(stateValue, 'stateGroup.states.text', equation);
      if(itemName) return this.getSuggestionsForWord(itemName, 'listItems', listName);
      return this.getSuggestionsForWord(listName, 'title', '');
    },
    async getSuggestionsForWord(word, field, equation) {
      // we need to pass in the equation, up to this part.
      // console.log(word, field, equation);
      const suggestions = await algoliaIndex.search(`${word}`, {
        hitsPerPage: 10,
        restrictSearchableAttributes: [field]
      });
      console.log('suggestions', suggestions, suggestions.hits.length);

      this.equationSuggestions = suggestions.hits.map(hit => ({title: `${equation}"${hit.title}"`}));
    },
  },
};
</script>

<style scoped></style>
