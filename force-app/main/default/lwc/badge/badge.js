import { LightningElement, api } from "lwc";

export default class Badge extends LightningElement {
  _label = "Other";

  @api
  set label(value) {
    this._label = value ? value : "Other";
  }
  get label() {
    return this._label;
  }
}
