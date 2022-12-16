<template>
  <div v-if="updatedList?.slug">
  <v-badge
    overlap
    offset-x="100"
    class="list-card-badge"
    content="adult content"
    :value="!!updatedList.adultContent"
    color="red"
  >
    <v-card
      light
      :color="updatedList.color"
      :style="textStyles"
      class="list-card mb-2 mr-0 d-flex align-stretch flex-row"
      :class="cardClasses"
      elevation="3"
      :to="{ name: 'List', params: { slug: updatedList.slug } }"
    >
      <v-img
        :src="updatedList.image || 'https://picsum.photos/200/300'"
        max-width="100"
        :class="imageClasses"
      />
      <v-container
        class="ma-0 pa-1 align-self-start"
        dark
      >
        <v-card-title class="mt-0 mb-3 pa-0 px-1 font-weight-bold">
          {{ updatedList.title }}
        </v-card-title>

        <v-card-subtitle
          class="ml-0 px-1 text-subtitle-2"
          dark
        >
          {{ updatedList.description }}
        </v-card-subtitle>
        <v-card-text class="ml-0 px-1">
          <v-list
            dense
            class="ml-0 px-0"
          >
            <v-list-item-title class="ml-0 px-0 font-weight-medium text-decoration-underline">
              Next Items:
            </v-list-item-title>
            <v-list-item
              v-if="!updatedList.nextItems || updatedList.nextItems.length < 1"
              class="font-weight-bold"
            >
              There is nothing to do in this list. Click this card to add your quest items.
            </v-list-item>
            <list-item
              v-for="item in updatedList.nextItems"
              :key="item.order"
              class="ml-0 px-0"
              :color="globalPreferences.defaultStateGroup.color"
              :list-item="item"
              :states="states || globalPreferences.defaultStateGroup.states"
              read-only
              @click.prevent.stop="null"
            />
          </v-list>
        </v-card-text>
      </v-container>
    </v-card>
  </v-badge>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getListStates } from '../firebase';
import { contrastColor } from '../util';
import ListItem from './ListItem.vue';

export default {
  name: 'ListCard',
  components: {
    ListItem,
  },
  props: {
    list: {
      type: Object,
      default: () => ({}),
      description: 'The list that is to be shown. Should contain listItems, title, description, and image',
    },
    large: {
      type: Boolean,
      default: false,
      description:
        'Whether to use a layout suitable for larger cards, where The image is on top and more items are shown.',
    },
  },
  data: () => ({
    updatedList: () => ({}),
    states: [],
  }),
  computed: {
    ...mapState(['globalPreferences']),
    cardClasses() {
      if (this.$vuetify.display.lgAndUp) return 'rounded-t-xl';
      if (this.$vuetify.display.smAndDown) return 'rounded-xl';
      return '';
    },
    imageClasses() {
      if (this.$vuetify.display.lgAndUp) return 'rounded-tl-xl rounded-tr-0';
      if (this.$vuetify.display.smAndDown) return 'rounded-l-xl rounded-tr-0';
      return '';
    },
    textStyles() {
      return `color: ${contrastColor('#888888', this.updatedList.color)};`;
    },
  },
  async mounted() {
    this.states = await getListStates(this.list);
    this.updatedList = this.$props.list;
  },
};
</script>

<style scoped>
ul {
  margin-left: 0px;
  padding-left: 0px;
  li {
    padding-left: 0px;
    margin-left: 0px;
  }
}
.v-list {
  background: none;
}
.large-image {
  max-height: 100%;
  max-width: 50%;
}
.small-image {
  max-width: 30%;
  max-height: 100%;
}
ul {
  list-style-type: none;
  li {
    line-height: 30px;
  }
}
.list {
  height: 99px;
  overflow: auto;
}
.v-list-item {
  display: flex;
  padding: 0px;
  align-items: stretch;
}

.list-image {
  border-radius: 10px;
  width: 30%;
}
.v-card.list-card {
  .v-card__title,
  .v-card__subtitle,
  .v-card__text,
  .v-list,
  .v-list .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled),
  .v-list .v-list-item__title {
    color: inherit !important;
  }
}
</style>
