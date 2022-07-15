<template>
  <v-container class="about">
    <v-card elevation="3">
      <v-card-title>About QuestLists</v-card-title>
      <v-card-text>
        <p>QuestLists is an open-sourced,  collaborative project.</p>
        <h3>More Information</h3>
        <v-list>
          <v-list-item
            link
            href="https://github.com/BizziQuest/QuestListsFB"
            target="_new"
          >
            <v-list-item-action><v-icon>mdi-github</v-icon></v-list-item-action>
            <v-list-item-content>
              Grab the Source or Contribute on Github
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            to="/about/terms-of-service"
          >
            <v-list-item-action><v-icon>mdi-text-box-check</v-icon></v-list-item-action>
            <v-list-item-content>
              View our Terms of Service
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            to="/about/privacy-policy"
          >
            <v-list-item-action><v-icon>mdi-shield-account</v-icon></v-list-item-action>
            <v-list-item-content>
              View our Privacy Policy
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            to="/about/code-of-conduct"
          >
            <v-list-item-action><v-icon>mdi-account-multiple</v-icon></v-list-item-action>
            <v-list-item-content>
              View our Code of Conduct
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>
