import { LightningElement, api, wire } from "lwc";
import { BADGE_COLOR_EVENT_NAME } from "c/constants";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Badge extends LightningElement {
  subscription = null;
  badgeColor;
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
    this.badgeColor = message.badgeColor;

    const badge = this.template.querySelector(".badge");
    const isDark = this.colorIsDark(this.badgeColor);
    if (badge) {
      badge.style.setProperty(
        "--sds-c-badge-color-background",
        this.badgeColor
      );
      badge.style.setProperty(
        "--sds-c-badge-text-color",
        isDark ? "#ffffff" : "#000000"
      );
    }
  }

  colorIsDark(color) {
    const hex = color.replace("#", "");
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
    return brightness <= 155;
  }
}
