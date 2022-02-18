import QuestlistsLogo from '../components/QuestListsLogo.vue';

export default {
  title: 'Components/QuestLists Logo',
  component: QuestlistsLogo,
  argTypes: {
    // backgroundColor: { control: 'color' },
    variant: { control: { type: 'select', options: [undefined, 'plus', 'alt', 'alt2', 'alt3', 'alt4', 'alt5'] } },
    decoration: { control: { type: 'select', options: [undefined, 'plus', 'alt', 'alt2', 'alt3', 'alt4', 'alt5'] } },
  },
  args: {
    variant: '',
    size: 60,
    color: 'secondary',
  },
};

const fontTable = {
  '27B0': {
    questlists: '➰',
    'ql-CurlyLoopEmoji': '➰',
  },
  '002B': {
    'ql-plus': '+',
  },
  '0030': {
    'ql-zero': '0',
  },
  2717: {
    'ql-ballotx': '✗',
  },

  '002D': {
    'ql-hyphen': '-',
  },

  '0078': {
    'ql-x': 'x',
  },

  '0051': {
    'ql-Q': 'Q',
  },

  '0070': {
    'ql-p': 'p',
  },

  2713: {
    'ql-checkmark': '✓',
  },

  2718: {
    'ql-HeavyBallotX': '✘',
  },

  '274C': {
    'ql-CrossMarkEmoji': '❌',
  },

  '006E': {
    'ql-n': 'n',
  },

  2699: {
    'ql-GearEmoji': '⚙',
  },

  2705: {
    'ql-WhiteHeavyCheckMarkEmoji': '✅',
  },

  2714: {
    'ql-HeavyCheckMarkEmoji': '✔',
  },

  '2A37': {
    'ql-MultiplicationSignInDoubleCircle': '⨷',
  },

  '270D': {
    'ql-WritingHandEmoji': '✍',
  },

  '270F': {
    'ql-PencilEmoji': '✏',
  },

  2710: {
    'ql-UpperRightPencil': '✐',
  },

  2712: {
    'ql-BlackNibEmoji': '✒',
  },

  '25B7': {
    'ql-WhiteRightPointingTriangle': '▷',
  },

  '25B6': {
    'ql-BlackRightPointingTriangle': '▶',
  },

  '25BB': {
    'ql-WhiteRightPointingPointer': '▻',
  },

  '26ED': {
    'ql-GearWithoutHub': '⛭',
  },

  2605: {
    'ql-BlackStar': '★',
  },

  '1F511': {
    'ql-key': '🔑',
  },

  2193: {
    'ql-arrowdown': '↓',
  },

  2190: {
    'ql-arrowleft': '←',
  },

  2192: {
    'ql-arrowright': '→',
  },

  2191: {
    'ql-arrowup': '↑',
  },

  '1F50E': {
    'ql-RightMagnifyingGlass': '🔎',
  },

  '23FF': {
    'ql-ObserverEye': '⏿',
  },

  2766: {
    'ql-FleuronCenter': '❦',
  },

  '26A1': {
    'ql-HighVoltageSign': '⚡',
  },

  '1F4CD': {
    'ql-RoundPushpin': '📍',
  },

  '1F512': {
    'ql-lock': '🔒',
  },

  '27F3': {
    'ql-ClockwiseGappedCircleArrow': '⟳',
  },

  '1F557': {
    'ql-ClockFaceEightOClock': '🕗',
  },

  '0021': {
    'ql-exclam': '!',
  },

  '1F513': {
    'ql-OpenLock': '🔓',
  },

  '1F393': {
    'ql-GraduationCap': '🎓',
  },

  '1F3A9': {
    'ql-GraduationCapAlt': '🎩',
  },

  '1F5D8': {
    'ql-ClockwiseSemicircleArrows': '🗘',
  },

  '1F5F2': {
    'ql-LightningMood': '🗲',
    'ql-lightning': '🗲',
  },

  '1F517': {
    'ql-LinkSymbolEmoji': '🔗',
    'ql-link': '🔗',
  },
};
const VuetifyIcons = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestlistsLogo },
  template:
    '<span :style="`font-size: 33px`">Look at this logo: <v-icon :color="color">'
    + '$questlists{{variant ? `-${variant}` : ""}}</v-icon></span>',    // eslint-disable-line
});

const LogoTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestlistsLogo },
  template: '<QuestlistsLogo v-bind="$props"/>',
});
const FontTemplate = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { QuestlistsLogo },
  template: `<v-simple-table light style="font-size: 130%;">
  <template v-slot:default>
    <thead>
      <tr>
        <th class="text-left">
          Unicode
        </th>
        <th class="text-left">
          Unicode Glyph
        </th>
        <th class="text-left">
          Icon Class
        </th>
        <th class="text-left">
          QuestLists Icon
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, unicode) in fontTable"
        :key="item.key"
      >
        <td>{{ unicode }}</td>
        <td>{{ Object.values(item)[0] }}</td>
        <td>{{ Object.keys(item).join(', ') }}</td>
        <td><i style="font-size: 140%" :class="\`ql \${Object.keys(item).join(', ')}\`"></i></td>
      </tr>
    </tbody>
  </template>
</v-simple-table>`,
});

export const Component = LogoTemplate.bind({});
Component.args = {
  size: 24,
  variant: '',
};

export const AsVuetifyIcons = VuetifyIcons.bind({});
AsVuetifyIcons.args = {
  size: 24,
  variant: 'alt5',
};

export const AsFont = FontTemplate.bind({});
AsFont.args = { fontTable };
