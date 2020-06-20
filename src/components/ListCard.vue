<template>
  <v-card
    max-height="auto"
    :color="list.bgColor"
    style="margin-bottom: 20px; margin-right: 0px; border-radius: 25px;"
  >
    <v-list-item>
      <!--v-img
      :class="large ? 'large-image' : 'small-image'"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      ></v-img-->
      <v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"></v-img>
      <v-list-item-content>
        <div class="overline mb-4">{{list.title}}</div>
        <v-list-item-title class="headline mb-1">{{list.description}}</v-list-item-title>
        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
        <ul>
          <li v-for="item in list.listItems" :key="item.text">[{{ item.state }}] {{ item.text }}</li>
          <li>more...</li>
        </ul>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn fab>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab>
            <v-icon>pageview</v-icon>
          </v-btn>
        </v-card-actions>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: 'ListCard',
  props: ['list', 'large'],
};
</script>

<style lang="scss" scoped>
* {
  color: black;
}
.large-image {
  max-height: 100%;
  max-width: 50%;
}
.small-image {
  max-width: 100%;
  max-height: 50%;
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
   display:flex;
  padding: 0px;
  align-items: stretch;
}
// .v-responsive__content {
//   margin-left: 20px;
//   height: 50px;
// }
.v-image {
  border-radius: 25px;
  width: 100px;
  // height: 100%;
}
</style>
