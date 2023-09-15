<template>
  <div>
    <div class="d-flex flex-nowrap align-items-start">
    <v-autocomplete
      v-model="equation"
      v-model:search="equationAutocomplete"
      :loading="loading"
      :items="equationSuggestions"
      item-title="title"
      item-value="value"
      class="w-75 inline-block"
      density="comfortable"
      hide-no-data
      hide-details
      label="Dependency. Start typing to search for a list or item."
      @input="findNextAutocomplete"
      @update:search="findNextAutocomplete({target: {value: $event}})"
    >
  </v-autocomplete>
  <v-btn slot="append" icon="mdi-content-save-outline" class="ml-3" @click="$emit('update:dependency', equation)"></v-btn>
  </div>
    <small>This list will only show if the dependency above are met. The format is
      <code>"&lt;list_name&gt;"."&lt;item_name&gt;" &lt;operator&gt; "&lt;value&gt;"</code>.
      Quotes are not optional, but can be single or double-quotes.</small>
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
      equation: this.dependency || '',
      loading: false,
      equationSuggestions: [],
      algoliaSearchClient: algolia,
      autocompleteQuestList: null,
    };
  },
  mounted() {
    this.parseEquationString(this.dependency);
  },
  watch: {
    dependency(newValue) {
      this.equation = newValue;
      this.parseEquationString(this.dependency);
    }
    // equationAutocomplete(val) {
    //   this.findNextAutocomplete(val);
    // },
  },
  methods: {
    async parseEquationString(equationString) {
      this.equation = equationString;
      const equations = this.equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
      const lastEquation = equations.at(-1).trim();
      const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
      const [listName, itemName] = item.split('.');
      const listNamePivot = new RegExp(`${listName}$`);
      const previousText = equationString.split(listNamePivot).slice(0,-1);
      const suggestions = await this.getSuggestionsForWord(listName, 'title', previousText);
      this.lastSuggestions = suggestions;
      this.autocompleteQuestList = this.lastSuggestions?.[0];
    },
    /**
     *
     * @param {InputEvent} $event
     */
    async findNextAutocomplete($event) {
      // TODO: add support for the 'in' operator
      // TODO: if there are two lists with the same name, use the slug instead

      /**@type {string} */
      const equation = $event.target.value;
      const equations = equation.split(/\band\b|\bor\b/i); // Split by 'and' or 'or'
      const lastEquation = equations.at(-1).trim();
      const [item, stateValue] = lastEquation.split(/==|!=|in|<|<=|>|>=/ig); // split by == != in < <= > >=
      const [listName, itemName] = item.split('.');
      if(stateValue) {
        const stateValuePivot = new RegExp(`${stateValue}$`);
        const previousText = $event.target.value.split(stateValuePivot).slice(0,-1)
        return this.getSuggestionsForStateValue(stateValue, previousText );
      }
      if(itemName !== undefined) {
        this.autocompleteQuestList = this.lastSuggestions?.[0];
        const itemNamePivot = new RegExp(`${itemName}$`);
        const previousText = $event.target.value.split(itemNamePivot).slice(0,-1);
        return this.getSuggestionsForItemName(itemName, previousText);
      }
      const listNamePivot = new RegExp(`${listName}$`);
      const previousText = $event.target.value.split(listNamePivot).slice(0,-1);
      const suggestions = await this.getSuggestionsForWord(listName, 'title', previousText);
      this.lastSuggestions = suggestions;
      return suggestions;

    },
    getSuggestionsForItemName(word, equation) {
      if(word === '') {
        this.equationSuggestions =  this.autocompleteQuestList.listItems.map(item => ({title: `${equation}"${item}"`}));
        return;
      }

      this.equationSuggestions = this.autocompleteQuestList.listItems.filter(listItem =>
        listItem.toLowerCase().includes(word.toLowerCase().replace(/['"]/g,''))
      ).map((listItem) => ({title: `${equation}"${listItem}"`}));
    },
    getSuggestionsForStateValue(word, equation) {
      const spaceAfterOperator = word.match(/^\s*/)[0];
      if(word === '' || word === undefined || word === null || /\s+['"]?/.test(word)) {
        this.equationSuggestions =  this.autocompleteQuestList.stateGroup.states.map(item => ({title: `${equation}${spaceAfterOperator}"${item.text}"`}));
        return;
      }
      this.equationSuggestions = this.autocompleteQuestList.stateGroup.states.filter(state =>
        state.text.includes(word.toLowerCase().replace(/['"]/g,''))
      ).map((state) => ({title: `${equation}${spaceAfterOperator}"${state.text}"`}));
    },
    async getSuggestionsForWord(word, field, equation) {

      const suggestions = await algoliaIndex.search(`${word}`, {
        hitsPerPage: 10,
        restrictSearchableAttributes: [field],
        cacheable: false,  // XXX: is this even an issue? if an item is editing during the entry phase, it will nor bew shown. this is a somewhat fix for this, but i don't think there is one.
      });

      this.equationSuggestions = suggestions.hits.map(hit => ({title: `${equation}"${hit[field]}"`}));
      return suggestions.hits;
    },
  },
};
</script>

<style scoped></style>
