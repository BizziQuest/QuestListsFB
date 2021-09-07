import QuestlistsLogo from '../components/QuestListsLogo.vue';

export default {
  title: 'Components/QuestLists Logo',
  component: QuestlistsLogo,
  argTypes: {
    // backgroundColor: { control: 'color' },
    variant: { control: { type: 'select', options: [undefined, 'plus', 'alt', 'alt2', 'alt3', 'alt4', 'alt5'] } },
  },
  args: {
    variant: '',
    size: 24,
    color: 'secondary',
  },
};

const FontTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestlistsLogo },
  template: '<span :style="`font-size: 33px`">Look at this logo: <v-icon :color="color">$questlists{{variant ? `-${variant}` : ""}}</v-icon></span>',
});

const LogoTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestlistsLogo },
  template: '<QuestlistsLogo v-bind="$props"/>',
});

export const Component = LogoTemplate.bind({});
Component.args = {
  size: 24,
  variant: '',
};

export const AsFont = FontTemplate.bind({});
AsFont.args = {
  size: 24,
  variant: 'alt5',
};
