<template>
  <div class="list-item-view">
    <template>
      <v-container>
        <v-row>
          <v-col col="12" md="6">
            <v-icon
              large
              class="listitem-icon"
              :outlined="isActive"
              @click.prevent="cycleIcon"
              @blur="deactivate"
              :title="iconTitle"
            >{{icon}}</v-icon>
            <v-text-field
              style="margin-bottom:20px;"
              :value="listItem.title"
              @change="listItem.title = $event"
              @input="updateText($event)"
              :outlined="isActive"
              @click.prevent="activate"
              @blur="deactivate"
              :placeholder="placeholder"
              >{{ listItem.isNewItem ? '' : listItem.title }}</v-text-field
            >
            <v-btn @click='makeSublist()'>add Sublist</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ensureSlugUniqueness, auth } from '../firebase';

export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'List Item is an object in the form: {title, state}',
    },
    states: {
      type: Array,
      default: () => [],
      description: 'The list of states that this item should have.',
    },
    isNewItem: {
      type: Boolean,
      description: 'it is new item entry',
    },
  },
  data: () => ({
    isActive: false,
    currentStateIdx: 0,
  }),
  methods: {
    deactivate() {
      this.isActive = false;
      this.$emit('blur', this.listItem);
    },
    activate() {
      this.isActive = true;
    },
    updateText(text) {
      this.$emit('update:text', text);
    },
    cycleIcon() {
      if (this.isNewItem) return;
      this.activate();
      let nextIdx = this.currentStateIdx + 1;
      if (nextIdx > this.states.length - 1) nextIdx = 0;
      this.currentStateIdx = nextIdx;
    },
    async makeSublist() {
      const stateGroup = this.getGlobalPreferences.defaultStateGroup;
      const payload = {
        title: this.listItem.title,
        slug: await ensureSlugUniqueness(this.listItem.title),
        // color: this.color,
        stateGroup,
        // description: this.description,
        createdAt: Date.now(), // firestore.Timestamp(),
        createdBy: auth.currentUser.uid,
      };
      this.$store.dispatch('createList', payload);
      // once we have a newly-created list, we uppdate the value
      // of this list item to be a reference to the new list
    },
  },
  computed: {
    ...mapGetters(['itemStates', 'getGlobalPreferences']),
    icon() {
      if (this.isNewItem) return 'mdi-plus';
      return this.states[this.currentStateIdx] && this.states[this.currentStateIdx].icon;
    },
    iconTitle() {
      return this.states[this.currentStateIdx] && this.states[this.currentStateIdx].name;
    },
    placeholder() {
      return this.listItem.isNewItem ? 'New Item' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.listitem-icon {
  display: inline-flex;
  margin-right: 10px;
}
.listitem-text {
  display: inline-block;
}
</style>
