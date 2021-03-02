import { LightningElement, api } from "lwc";

export default class Select extends LightningElement {
  @api selectId;
  @api options;
  @api required;
  error;
  _value;

  @api
  get value() {
    return this._value;
  }
  set value(value) {
    if (value) {
      console.log("value", value);
      const el = this.template.querySelector("select");
      console.log("el", JSON.parse(JSON.stringify(el)));
      if (el) {
        el.value = value;
      }
    }
  }

  handleChange(event) {
    const value = event.target.value;
    const id = event.target.dataset.id;
    const evt = new CustomEvent("change", { detail: { id, value } });
    this.dispatchEvent(evt);
  }

  get formClass() {
    return this.error
      ? "slds-form-element slds-has-error"
      : "slds-form-element";
  }
}
