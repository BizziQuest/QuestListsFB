<template>
  <svg v-if="size > 500" width="500" height="500" viewbox="0 0 500 500">
    <path :d="absolutePath"></path>
  </svg>
  <svg v-else :width="size" :height="size" viewbox="0 0 26 26">
    <path :d="variant ? variants[variant] : size24" :transform="`scale(${size/26})`"></path>
    <path v-if="decoration" :d="decoration ? decorations[decoration] : null" :transform="`scale(${size/26})`"></path>
  </svg>
</template>

<script>
// see https://yqnn.github.io/svg-path-editor/

export default {
  name: 'QuestListsLogo',
  props: {
    size: {
      default: 24,
      type: Number,
      description: 'Size of the logo in pixels',
    },
    variant: null,
    decoration: null,
  },
  data: () => ({
    relativePath: 'm 150 350 c 50 0 50 -50 50 -50 a 50 50 0 0 1 100 0 a 50 50 0 0 0 100 0 a 50 50 0 1 0 -100 0',
    // eslint-disable-next-line max-len
    absolutePath: 'M 150 350 C 200 350 200 300 200 300 A 50 50 0 0 1 300 300 A 50 50 0 0 0 400 300 A 50 50 0 1 0 300 300',
    size18: 'M 7 17 C 10 17 10 14 10 14 A 3 3 0 0 1 16 14 A 3 3 0 0 0 22 14 A 3 3 0 1 0 16 14',
    // eslint-disable-next-line max-len
    size24: 'M 0.5123 16.3203 C 5.1232 16.3203 5.1232 11.7094 5.1232 11.7094 A 4.6109 4.6109 90 0 1 14.3449 11.7094 A 4.6109 4.6109 90 0 0 23.5666 11.7094 A 4.6109 4.6109 90 1 0 14.3449 11.7094',
    variants: {
      // eslint-disable-next-line max-len
      plus: 'M 0.5123 16.3203 C 5.1232 16.3203 5.1232 11.7094 5.1232 11.7094 A 4.6109 4.6109 90 0 1 14.3449 11.7094 A 4.6109 4.6109 90 0 0 23.5666 11.7094 A 4.6109 4.6109 90 1 0 14.3449 11.7094 M 21 18 L 21 24 M 18 21 L 24 21',
      alt: 'm 5 10 a 1 1 0 0 0 0 -9 a 1 1 0 0 0 0 9 a 1 1 0 0 1 9 0 a 1 1 0 0 1 9 0',
      alt2: 'm 11 6 a 1 1 0 0 0 -10 0 a 1 1 0 0 0 10 0 a 1 1 0 0 1 7 0 a 1 1 0 0 1 5 0',
      alt3: 'm 11 6 a 1 1 0 0 0 -10 0 a 1 1 0 0 0 10 0 a 1 1 0 0 0 7 0 a 1 1 0 0 1 5 0',
      alt4: 'm 11 6 a 1 1 0 0 0 -10 0 a 1 1 0 0 0 10 0 a 1 1 0 0 0 7 0 a 1 1 0 0 0 5 0',
      alt5: 'm 11 12 a 1 1 0 0 0 -10 0 a 1 1 0 0 0 10 0 m -5 0 a 1 1 0 0 0 10 0 a 1 1 0 0 1 7 0',
    },
    decorations: {
      // eslint-disable-next-line max-len
      plus: 'm -3 -3 l 6 0',
    },
  }),
  methods: {},
};
</script>

<style scoped>
svg {
  stroke: currentColor;
  fill: none;
  stroke-width: 2px;
}
</style>
