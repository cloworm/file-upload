import { LightningElement, api, wire } from "lwc";
import { BADGE_COLOR_EVENT_NAME } from "c/constants";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Badge extends LightningElement {
  subscription = null;
  hasRendered = false;
  _label = "Other";

  @api
  set label(value) {
    this._label = value ? value : "Other";
  }
  get label() {
    return this._label;
  }

  // Get Current pageReference to allow PubSub to function
  @wire(CurrentPageReference) pageRef;

  renderedCallback() {
    if (this.hasRendered) return;
    registerListener(BADGE_COLOR_EVENT_NAME, this.handleSub, this);
    this.hasRendered = true;
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleSub(message) {
    const badge = this.template.querySelector(".badge");
    if (badge) {
      badge.style.setProperty(
        "--sds-c-badge-color-background",
        message.badgeColor
      );
      badge.style.setProperty(
        "--sds-c-badge-text-color",
        message.badgeTextColor
      );
    }
  }
}
