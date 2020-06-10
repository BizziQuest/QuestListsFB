[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/BizziQuest/QuestListsFB) 

![Run Tests](https://github.com/BizziQuest/QuestListsFB/workflows/Run%20Tests/badge.svg)

# QuestLists

QuestLists is a crowd-sourcing application that organizes lists of any sort. The crowd builds the lists, you 
say what you want to use from that list, and then use it as a normal checklist. At its heart, this is 
an _n_-state checklist application.

The intention is to use the crowd to build lists for games, inventories, shopping, music, videos, and more! 
Once the lists are built and created, you can add/remove your items from them. It uses the browser's caching 
for data, so you don't even have to login to use it (only for the same devise)!

NOTE: This is the frontend for QuestLists, with a firebase backend, by default. More backends will be 
developed separately.

## Demo

This is the public code for http://skamansam.github.io/questlists. The code is redeployed when I finish any 
feature or want to test something, so it may change a lot and may break down  often. I will do my best not 
to disturb any data that is already there, but be warned, your data may be a casualty of development!

Once everything is stable, it will become a REAL application, and all the notices about the demo will be removed.

## Roadmap

Questlists is originally intended for game quests, so will have the following ideas implemented first:

  1. Your progress in quests.
  2. Items collected
  3. Overall progress in the game
  4. Locations reached
  5. Information about any other object in the game

I am sure you can generalize these ideas to fit any circumstance, so i will eventually create a few demos 
of lists for everyday use, such as a shopping list and various TODO lists.


# Contributing

To keep things simple, I am only using GitHub and associated tools that anyone can use. I am even deploying 
this app to GitHub pages. For ticket management, I am using ZenHub, so you can use it too, if you want. All 
tickets will be managed through ZenHub, but you can create Issues in GitHub if you want, as well.

## GitHub

If you would like to help with development of this project, follow these instructions:
```text
TL;DR - Fork repo and create a new branch for each issue, then create a new pull request. I won't be too 
harsh on the rest.
```

  1. fork this repo (or ask to join the BizziQuest team!)
  2. See if there is an issue currently in GitHub that addresses your feature, bugfix, etc. If not, create one!
  3. create a new branch in your forked repo, including the ticket number in the branch name, like 
  `4-my-new-feature` or `my-new-feature_issue-4` or `my_new_feature-issue_4`. You get the idea.
  4. hack away!
  5. When committing your changes, please make sure you include the ticket number in the description, surrounded b
  y brackets. Something like `make sure we use the correct ES2016 syntax for foo-bar elements. [46]`. The commit 
  message should read like a command, not a summary of what you did. (This is a hard one to follow, as you can 
  tell from my commit messages, but it really does help new-comers get an understanding of what's going on.)
  6. Make sure ALL tests run successfully by running `yarn check`. This is to ensure you do not bug the application.
  Automated tests run for every PR and merge, and any code will not be merged without passing tests.
  7. Create a new pull request against the develop branch once you are happy with your code
  8. Wait for the team to review and merge the changes. Merges cannot happen without review.

## App Setup
We are using node version 10.x, due to compatibility with the firebase libraries. You should be using it as well. 
You can [install nvm](https://github.com/nvm-sh/nvm) to manage local versions of node.

```
nvm use
yarn
yarn serve
```

## Running Questlists for Development

Just run the `bin/start` script from the repo's directory.

## Deploying Questlists

You can deploy to your own repo's github page by running the `bin/deploy` script from the repo's directory.

## Code Style Guide
Having a style guide really helps code readability and lessens cognitive overhead when developing software. I will use the style guidelines set forth in the [Polymer Guide](https://www.polymer-project.org/2.0/docs/devguide/feature-overview)'s section on [Documenting your elements](https://www.polymer-project.org/2.0/docs/tools/documentation), with the following addendums:

1. Method Names
  1. Public methods are camel-case
  2. private methods should be snake-case and start with an underscore
  3. Special Cases: Public methods that may not be part of a public API should be snake-case. This includes alias or router methods. You should say why in the comments.
2. HTML Element Attributes
  If your element decalaration is very long, and uses a lot of attributes, do the following:
  1. Put the id attribute first, on the same line as the element declaration.
  2. Put any boolean attributes on a line of their own
  3. Put the rest of the attributes each on a line of their own.
  4. the closing bracket aligns with the opening bracket, and the closing tag aligns with the opening tag.

  Example:
  ```HTML
    <my-element id="my_elem"
      isCool hasFoo isBar reallyNeat
      message="this is a text thing"
      config="{some: {js: {'obj'}}}"
    >
      <p>
        Here is a test element!
      </p>
    </my-element>
  ```
