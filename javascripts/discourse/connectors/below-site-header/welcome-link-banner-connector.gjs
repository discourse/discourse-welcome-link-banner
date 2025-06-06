import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import { eq } from "truth-helpers";
import WelcomeLinkBanner from "../../components/welcome-link-banner";

@classNames("below-site-header-outlet", "welcome-link-banner-connector")
export default class WelcomeLinkBannerConnector extends Component {
  <template>
    {{#if (eq settings.plugin_outlet "below-site-header")}}
      <WelcomeLinkBanner />
    {{/if}}
  </template>
}
