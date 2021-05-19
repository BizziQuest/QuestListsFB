import CustomColorPicker from '@/components/CustomColorPicker.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import toHaveBeenWarnedInit from '../toHaveBeenWarned';

toHaveBeenWarnedInit();

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(Vuetify);

let wrapper;

beforeEach(() => {
  wrapper = mount(CustomColorPicker, {
    localVue,
    vuetify,
  });
});
afterEach(() => {
  wrapper = undefined;
});
describe('the toolbar', () => {
  it('should show the color picker canvas when the palette button is clicked', async () => {
    expect(Array.isArray(wrapper.vm.colorPickerState)).toBe(true);
    expect(wrapper.vm.colorPickerState.length).toBe(0);
    await wrapper.find('[test-canvas-btn]').trigger('click');
    expect(wrapper.vm.colorPickerState).toStrictEqual([2]);
    expect('Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)')
      .toHaveBeenErrored();
  });
  it('should show the color picker sliders when the guage button is clicked', async () => {
    expect(Array.isArray(wrapper.vm.colorPickerState)).toBe(true);
    expect(wrapper.vm.colorPickerState.length).toBe(0);
    await wrapper.find('[test-sliders-btn]').trigger('click');
    expect(wrapper.vm.colorPickerState).toStrictEqual([1]);
    expect('[Vuetify] Missing v-app or a non-body wrapping element with the [data-app] attribute').toHaveBeenWarned();
  });
  it('should show the color picker inputs when the input button is clicked', async () => {
    expect(Array.isArray(wrapper.vm.colorPickerState)).toBe(true);
    expect(wrapper.vm.colorPickerState.length).toBe(0);
    await wrapper.find('[test-inputs-btn]').trigger('click');
    expect(wrapper.vm.colorPickerState).toStrictEqual([0]);
  });
  it('should show the color picker canvas and sliders when the input button is clicked', async () => {
    expect(Array.isArray(wrapper.vm.colorPickerState)).toBe(true);
    expect(wrapper.vm.colorPickerState.length).toBe(0);
    await wrapper.find('[test-canvas-btn]').trigger('click');
    await wrapper.find('[test-sliders-btn]').trigger('click');
    expect(wrapper.vm.colorPickerState).toStrictEqual([2, 1]);
    expect('Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)')
      .toHaveBeenErrored();
    expect('[Vuetify] Missing v-app or a non-body wrapping element with the [data-app] attribute')
      .toHaveBeenWarned();
  });
});
it('should default to show only the swatches.', () => {
  expect(wrapper.find('.v-color-picker').vm.$props.showSwatches).toBe(true);
  expect(wrapper.find('.v-color-picker').vm.$props.hideInputs).toBe(true);
  expect(wrapper.find('.v-color-picker').vm.$props.hideCanvas).toBe(true);
  expect(wrapper.find('.v-color-picker').vm.$props.hideSliders).toBe(true);
});
