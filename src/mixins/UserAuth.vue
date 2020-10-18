<script>
import { mapMutations } from 'vuex';
import { auth } from '../firebase';

export default {
  data: () => ({
    isUserVerified: false,
  }),
  methods: {
    ...mapMutations(['setUser']),
    async verifyUser() {
      this.isUserVerified = await this.$_isUserVerifiedPromise();
      // console.log(this.isUserVerified);
    },
    async $_isUserVerifiedPromise() {
      if (!auth.currentUser) return false;
      if (auth.currentUser.emailVerified) return true;
      await auth.currentUser.reload();
      this.setUser(auth.currentUser);
      return auth.currentUser.emailVerified;
    },
  },
  mounted() {
    this.verifyUser();
  },
};
</script>
