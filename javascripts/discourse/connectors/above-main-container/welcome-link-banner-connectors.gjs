/* eslint-disable ember/no-classic-components, ember/require-tagless-components */
import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import { eq } from "discourse/truth-helpers";
import WelcomeLinkBanner from "../../components/welcome-link-banner";

@classNames("above-main-container-outlet", "welcome-link-banner-connectors")
export default class WelcomeLinkBannerConnectors extends Component {
  <template>
    {{#if (eq settings.plugin_outlet "above-main-container")}}
      <WelcomeLinkBanner />
    {{/if}}
  </template>
}
