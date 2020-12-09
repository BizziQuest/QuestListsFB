import LogInorSignUp from '@/components/LogInorSignUp.vue';
import { shallowMount } from '@vue/test-utils';

const wrapper = shallowMount(LogInorSignUp);
expect(wrapper.text()).toBe('Log In or Sign Up');
