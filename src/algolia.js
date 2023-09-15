import algoliasearch from 'algoliasearch';
import {getDoc} from 'firebase/firestore';
const options = {};
if (import.meta.env.VITE_APP_ALGOLIA_HOST) {
  options.hosts = [{ url: import.meta.env.VITE_APP_ALGOLIA_HOST }];
}
const algoliaIndexName = import.meta.env.VITE_APP_ALGOLIA_INDEX_NAME;
const algoliaSuggestionIndexName = import.meta.env.VITE_APP_ALGOLIA_SUGGESTION_INDEX_NAME;
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


async function updateListInAlgolia(listData) {
  const stateGroupDoc = await getDoc(listData?.stateGroup);
  algoliaIndex.partialUpdateObject(
    { ...listData, stateGroup: stateGroupDoc?.data() || listData.newStateGroup, objectID: listData.id },
    { createIfNotExists: true }
  );
}


export default algoliaIndex;
export {
  algolia,
  algoliaIndexName,
  algoliaSuggestionIndexName,
  algoliaIndex,
  updateListInAlgolia,
};
