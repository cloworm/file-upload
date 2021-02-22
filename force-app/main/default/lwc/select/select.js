import { LightningElement, api } from "lwc";

export default class Select extends LightningElement {
  @api selectId;
  @api options;
  @api required;
  error;

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
