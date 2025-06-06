import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import icon from "discourse/helpers/d-icon";
import htmlSafe from "discourse/helpers/html-safe";
import { defaultHomepage } from "discourse/lib/utilities";
import { i18n } from "discourse-i18n";
import isExternalLink from "../helpers/is-external-link";

export default class WelcomeLinkBanner extends Component {
  @service router;
  @service currentUser;
  @service site;

  @tracked bannerLinks = settings.banner_links;
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

  <template>
    {{#if this.shouldShow}}
      <div class="welcome-link-banner-wrapper">
        <div class="wrap welcome-link-banner">
          <div class="welcome-wrapper">
            <div class="welcome-content">
              <h2>{{htmlSafe (i18n (themePrefix "meta_banner.welcome"))}}</h2>
              <p>{{htmlSafe (i18n (themePrefix "meta_banner.subtitle"))}}</p>
            </div>
            <div class="featured-banner-link">
              {{#each this.bannerLinks as |bl|}}
                <div>
                  <a
                    href={{bl.url}}
                    target={{if
                      (isExternalLink bl.url currentUser=this.currentUser)
                      "_blank"
                    }}
                  >
                    <h3>
                      {{icon bl.icon}}
                      {{bl.text}}
                    </h3>
                  </a>
                </div>
              {{/each}}
            </div>
            {{#if settings.can_be_dismissed}}
              <DButton
                class="btn-flat welcome-link-banner-close"
                @icon="xmark"
                @action={{this.dismiss}}
              />
            {{/if}}
          </div>
        </div>
      </div>
    {{/if}}
  </template>
}
