import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { defaultHomepage } from "discourse/lib/utilities";
export default Component.extend({
  router: service(),

  bannerLinks: computed(function () {
    return JSON.parse(settings.banner_links);
  }),

  @discourseComputed("currentUser")
  showTrust(currentUser) {
    return (
      (currentUser && currentUser.trust_level <= settings.max_trust_level) ||
      (!currentUser && !settings.hide_for_anon)
    );
  },

  @discourseComputed("currentUser")
  hideStaff(currentUser) {
    return currentUser && currentUser.staff && settings.hide_for_staff;
  },

  @discourseComputed("router.currentRouteName", "router.currentURL")
  showHere(currentRouteName, currentURL) {
    if (settings.show_on === "all") {
      return true;
    }

    if (settings.show_on === "discovery") {
      return currentRouteName.indexOf("discovery") > -1;
    }

    if (settings.show_on === "homepage") {
      return currentRouteName == `discovery.${defaultHomepage()}`;
    }
  },
});
