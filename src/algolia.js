import algoliasearch from 'algoliasearch';

const options = {};
if (import.meta.env.VITE_APP_ALGOLIA_HOST) {
  options.hosts = [{ url: import.meta.env.VITE_APP_ALGOLIA_HOST }];
}
const algoliaIndexName = import.meta.env.VITE_APP_ALGOLIA_INDEX_NAME;
const algolia = algoliasearch(import.meta.env.VITE_APP_ALGOLIA_APP_ID, import.meta.env.VITE_APP_ALGOLIA_API_KEY);
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
