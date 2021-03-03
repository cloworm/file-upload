import { LightningElement, api } from "lwc";

export default class Select extends LightningElement {
  @api selectId;
  @api options;
  @api required;

  handleChange(event) {
    const value = event.target.value;
    const id = event.target.dataset.id;
    const evt = new CustomEvent("change", { detail: { id, value } });
    this.dispatchEvent(evt);
  }
}
