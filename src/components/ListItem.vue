<template>
  <div>
    <template>
      <v-container>
        <v-row>
          <v-col col="12" md="6">
            <v-text-field
              style="margin-bottom:20px;"
              :value="listItem.text"
              @change="listItem.text = $event"
              :outlined="isOutlined"
              @click="outline"
              @blur="handleBlur"
              >{{ listItem.text }}</v-text-field
            >
          </v-col>
          <v-col col="12" md="6">
            <v-select
              style="margin-bottom:20px;"
              :items="allItemsStates"
              :label="listItem.state"
              @change = "listItem.state = $event"
              :outlined="isOutlined"
              @click="outline"
              @blur="handleBlur"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    listItem: {
      type: Object,
      default: () => ({}),
      description: 'The list item',
    },
  },
  data: () => ({
    isOutlined: false,
  }),
  methods: {
    handleBlur(e) {
      this.isOutlined = false;
      console.log('blur', e.target);
    },
    outline(e) {
      this.isOutlined = true;
      console.log('outline', e.target);
    },
    changeInputTextField(e) {
      console.log('changeInputTF', e);
      this.listItem.text = e;
    },
    // changeText($event) {
    //   console.log('changeText -> $event', $event.target.value);
    //   // this.item.text = $event.target.value; // Not allowed toi change property or sub props
    //   // this.item = { text: $event.target.value }; // Bad practeice
    //   // Avoid mutating a prop directly since the value will be overwritten
    //   // whenever the parent component re-renders. Instead, use a data or computed property
    //   //  based on the prop's value. Prop being mutated: "item"

    //   // correct way
    //   const localItem = { text: $event.target.value };
    //   this.$emit('myInput', localItem);
    // },
  },
  computed: {
    allItemsStates() {
      return this.$store.getters.itemStates;
    },
  },
};
</script>

<style lang="scss" scoped></style>
