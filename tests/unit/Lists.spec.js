import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import Lists from '@/views/QuestLists.vue';
import { algoliaIndex } from '../../src/algolia';
import { fetchQuestLists } from '../../src/firebase';

jest.mock('../../src/firebase.js');
jest.mock('../../src/algolia.js');

const localVue = createLocalVue();
const vuetify = new Vuetify();
const $route = { params: { slug: 'list123' } };

localVue.use(Vuex);

const localStore = new Vuex.Store({
  state: {
    currentUser: {
      avatar: '/img/unknown_user.svg', // when we set the user in the store, we default to this.
      displayName: null,
      email: 'tersterson3@test.com',
      emailVerified: false,
      uid: 'UUID123456',
      useGravatar: false,
    },
    lists: [],
  },
  mutations: {
    setLists: (state, payload) => {
      if (payload) {
        state.lists = payload;
      }
    },
  },
  actions: { fetchLists: jest.fn() },
});

describe('QuestLists.vue', () => {
  describe('when there are no lists', () => {
    let wrapper;
    beforeEach(async () => {
      localStore.state.lists = [];
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
        stubs: ['router-link'],
      });
      await flushPromises();
    });
    it('should show an alert saying there are no lists', () => {
      expect(wrapper.text()).toContain('Welcome to Quest Lists!');
    });
  });

  describe('when there is a list', () => {
    let wrapper; let
      lists;
    beforeEach(async () => {
      lists = [{ id: '1', title: 'list123' }];
      localStore.state.lists = lists;
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
        stubs: ['router-link'],
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });
    it('should show the list card', () => {
      expect(wrapper.findAll('.list-card').wrappers.length).toBe(1);
    });
    it('should not show the no lists warning', () => {
      expect(wrapper.html()).not.toContain('Welcome to Quest Lists!');
    });
    it('should show the name of the list', () => {
      expect(wrapper.findAll('.list-card').wrappers[0].text()).toContain(lists[0].title);
    });
  });
  describe('when there is a list with adult content', () => {
    it.todo('should show the adult content badge when appropriate. (jest can\'t test)');
    it.todo('should not show the adult content badge when appropriate. (jest can\'t test)');
  });

  describe('when searching for an item', () => {
    let wrapper;
    let lists = [];
    beforeEach(async () => {
      lists = [{ id: '1', title: 'list123' }, { id: '2', title: 'list456' }];
      localStore.state.lists = lists;
      // figure out to mock a callback
      // fetchQuestLists.mockResolvedValueOnce(lists[0])
      algoliaIndex.search.mockResolvedValueOnce(
        {
          hits: [
            {
              title: 'list123',
              slug: 'list123',
              color: '#308577',
              stateGroup: {
                description: 'Basic list states: Done and Not Done',
                states: [
                  {
                    color: '#0000ff',
                    icon: 'mdi-checkbox-blank-outline',
                    name: 'Not Done',
                    value: '0',
                    order: 0,
                  },
                  {
                    color: '#00ff00',
                    icon: 'mdi-checkbox-marked-outline',
                    name: 'Done',
                    value: '1',
                    order: 1,
                  },
                ],
                name: 'Done / Not Done',
                id: 'T7mo86Kmz6nbvkA6uygs',
              },
              description: '',
              createdAt: 1640665954087,
              createdBy: 'OTgSqsrVSDJqPtEjQdDwtsWSRxvp',
              parent: 'none',
              objectID: 'lSYmLBNVrpCLJpA7ns0q',
              _highlightResult: {
                title: {
                  value: '<mark>list123</mark>',
                  matchLevel: 'full',
                  fullyHighlighted: false,
                  matchedWords: [
                    'list123',
                  ],
                },
                slug: {
                  value: '<mark>list123</mark>',
                  matchLevel: 'full',
                  fullyHighlighted: false,
                  matchedWords: [
                    'list123',
                  ],
                },
                description: {
                  value: '',
                  matchLevel: 'none',
                  matchedWords: [],
                },
              },
            },
          ],
          nbHits: 1,
          page: 0,
          nbPages: 1,
          hitsPerPage: 20,
          exhaustiveNbHits: true,
          exhaustiveTypo: true,
          query: 'first',
          params: 'query=first',
          renderingContent: {},
          processingTimeMS: 1,
        },
      );
      wrapper = mount(Lists, {
        localVue,
        vuetify,
        store: localStore,
        mocks: {
          $route,
        },
        stubs: ['router-link'],
      });
      await flushPromises(); // for fetchList() call in List.mounted()
    });

    describe('when there are no matches', () => {
      it('should show the current list of items', async () => {
        await wrapper.find('.search-box input[type="text"]').setValue('listNoHere');
        await wrapper.find('.search-box input[type="text"]').trigger('keydown.enter');
        await wrapper.vm.$nextTick();
        lists.forEach((list) => {
          expect(wrapper.text()).toContain(list.title);
        });
      });
    });
    describe('when there are matches', () => {
      it('should show the current list of matched list cards', async () => {
        await wrapper.find('.search-box input[type="text"]').setValue('list123\n');
        lists.filter((list) => list.title === 'list123').forEach((l) => expect(wrapper.text()).toContain(l.title));
      });
      it('should not show the cards are not matched with the search box', async () => {
        await wrapper.find('.search-box input[type="text"]').setValue('list123');
        await wrapper.find('.search-box input[type="text"]').trigger('keydown.enter');
        await wrapper.vm.$nextTick();
        const f = fetchQuestLists;
        expect(f.mock.calls[0][0].slugs).toStrictEqual(['list123']);
        expect(f.mock.calls[0][0].callback).not.toStrictEqual(undefined);
        // TODO: figure out to mock a callback
        // lists.filter((list) =>list.title!=='list123').forEach((l)=>expect(wrapper.text()).not.toContain(l.title));
      });
    });
  });
});
