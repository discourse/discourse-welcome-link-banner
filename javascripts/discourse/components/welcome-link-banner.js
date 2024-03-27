import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";

export default class WelcomeLinkBanner extends Component {
  @service router;
  @service currentUser;
  @service site;

  @tracked bannerLinks = JSON.parse(settings.banner_links);
  @tracked
  dismissed = settings.can_be_dismissed
    ? localStorage.getItem("discourse_dismissedWelcomeLinkBanner")
    : false;

  get showTrust() {
    return (
      (this.currentUser &&
        this.currentUser.trust_level <= settings.max_trust_level) ||
      (!this.currentUser && !settings.hide_for_anon)
    );
  }

  get hideStaff() {
    return this.currentUser?.staff && settings.hide_for_staff;
  }

  get showHere() {
    if (settings.show_on === "all") {
      return true;
    }

    if (settings.show_on === "discovery") {
      return this.router.currentRouteName.indexOf("discovery") > -1;
    }

    if (settings.show_on === "homepage") {
      return this.router.currentRouteName === `discovery.${defaultHomepage()}`;
    }
  }

  get isMobileView() {
    return settings.hide_on_mobile && this.site.mobileView;
  }

  get shouldShow() {
    return (
      !this.dismissed &&
      !this.hideStaff &&
      !this.isMobileView &&
      this.showTrust &&
      this.showHere
    );
  }

  @action
  dismiss() {
    if (!settings.can_be_dismissed) {
      return;
    }
    this.dismissed = true;
    return localStorage.setItem("discourse_dismissedWelcomeLinkBanner", true);
  }
}
