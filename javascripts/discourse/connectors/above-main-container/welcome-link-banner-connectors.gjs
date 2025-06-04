import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import { eq } from "truth-helpers";
import WelcomeLinkBanner from "../../components/welcome-link-banner";

@classNames("above-main-container-outlet", "welcome-link-banner-connectors")
export default class WelcomeLinkBannerConnectors extends Component {
  <template>
    {{#if (eq settings.plugin_outlet "above-main-container")}}
      <WelcomeLinkBanner />
    {{/if}}
  </template>
}
