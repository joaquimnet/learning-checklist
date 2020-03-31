import { fetchPage, fetchListing } from './page-fetcher';
import Vue from 'vue/dist/vue.esm.browser';

new Vue({
  el: '#app',
  data: {
    pageListing: {},
    pages: {},
    currentPage: '<h1>Click on a link to navigate.</h1>',
    showUpButton: false,
  },
  computed: {
    sidebarItems() {
      return Object.keys(this.pageListing).map(category => {
        return {category, topics: this.pageListing[category]};
      });
    },
  },
  methods: {
    linkClicked(event) {
      event.preventDefault();

      const pageName = event.target.attributes.href.value;
      if (!pageName) return;

      if (this.pages[pageName]) {
        this.currentPage = this.pages[pageName];
        return;
      }

      fetchPage(pageName).then(res => {
        console.log(`Fetching ${pageName}...`);
        this.pages[pageName] = res;
        this.currentPage = res;
      });
    },
    clicked() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      if (window.scrollY >= this.remToPixels(4)) {
        // is visible
        this.showUpButton = true;
      } else {
        // is not visible
        this.showUpButton = false;
      }
    },
    remToPixels(rem) {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
    fetchListing().then(pageListing => {
      this.pageListing = pageListing;
    });
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
});
