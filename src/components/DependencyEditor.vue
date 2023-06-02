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
      algoliaSearchClient: algolia,
      autocompleteQuestList: null,
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
    parseEquationString() {
      const equationRegEx = /(?<line>(?<equation>(?<listNameQt>[\"\']?)(?<listName>.*?)\k<listNameQt>\.(?<itemNameQt>[\"\']?)(?<itemName>\w.*?)\k<itemNameQt>\s*(?<operator>[=!><]=?)\s*(?<stateValueQt>[\"\']?)(?<stateValue>\w.*?)\k<stateValueQt>(\s+(?<conjunction>and|or)\s+)?)+?)/ig;
      const matches = [equationRegEx.exec($event.target.value)];
      debugger;
      console.log('matches', matches);
      let match = null;
      while ((match = equationRegEx.exec($event.target.value)) != null) {
        matches.push(match);
      }
    },
    async findNextAutocomplete($event) {
      // NOTE: this means we only autocomplete for the last equation typed.
      // one way to get around is to have different inputs for each equation.
      const equation = $event.target.value;
      const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
      const lastEquation = equations.at(-1);
      const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
      const [listName, itemName] = item.split('.');
      console.log([listName, itemName, item, stateValue])
      if(stateValue) {
        const stateValuePivot = new RegExp(`${stateValue}$`);
        const previousText = $event.target.value.split(stateValuePivot).slice(0,-1)
        return this.getSuggestionsForStateValue(stateValue, previousText );
      }
      if(itemName !== undefined) {
        console.log('itemName')
        const itemNamePivot = new RegExp(`${itemName}$`);
        const previousText = $event.target.value.split(itemNamePivot).slice(0,-1);
        return this.getSuggestionsForItemName(itemName, previousText);
      }
      const listNamePivot = new RegExp(`${stateValue}$`);
      const previousText = $event.target.value.split(listNamePivot).slice(0,-1)
      const suggestions = await this.getSuggestionsForWord(listName, 'title', previousText);
      this.autocompleteQuestList = suggestions?.[0];
      return suggestions;

    },
    getSuggestionsForItemName(word, equation) {
      if(word === '') {
        this.equationSuggestions =  this.autocompleteQuestList.listItems.map(item => ({title: `${equation}"${item}"`}));
        console.log(this.equationSuggestions)
        return;
      }

      this.equationSuggestions = this.autocompleteQuestList.listItems.filter(listItem => {
        if(listItem.toLowerCase().includes(word.toLowerCase())) return {title: `${equation}"${listItem}"`}
      });
      console.log(this.equationSuggestions)
    },
    getSuggestionsForStateValue(word, equation) {
      this.equationSuggestions = this.autocompleteQuestList.stateGroup.states.filter(state => {
        if(state.text.contains(word)) return {title: `${equation}"${listItem}"`}
      });
    },
    async getSuggestionsForWord(word, field, equation) {

      const suggestions = await algoliaIndex.search(`${word}`, {
        hitsPerPage: 10,
        restrictSearchableAttributes: [field]
      });
      // console.log('suggestions', suggestions.hits.length, suggestions.hits.map(hit => ({title: `${equation}"${hit[field]}"`})));

      this.equationSuggestions = suggestions.hits.map(hit => ({title: `${equation}"${hit[field]}"`}));
      return suggestions.hits;
    },
  },
};
</script>

<style scoped></style>
