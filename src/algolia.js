import algoliasearch from 'algoliasearch';

const options = {};
if (process.env.VUE_APP_ALGOLIA_HOST) {
  options.hosts = [{ url: process.env.VUE_APP_ALGOLIA_HOST }];
}
const algoliaIndexName = process.env.VUE_APP_ALGOLIA_INDEX_NAME;
const algolia = algoliasearch(process.env.VUE_APP_ALGOLIA_APP_ID, process.env.VUE_APP_ALGOLIA_API_KEY);
const algoliaIndex = algolia.initIndex(algoliaIndexName);
algoliaIndex.setSettings({
  searchableAttributes: [
    'title', 'description', 'slug',
  ],
  customRanking: [
    'desc(title)',
  ],
});

export default algoliaIndex;
export {
  algolia,
  algoliaIndexName,
  algoliaIndex,
};
