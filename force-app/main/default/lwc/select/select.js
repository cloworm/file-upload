import { LightningElement, api } from "lwc";

export default class Select extends LightningElement {
  @api selectId;
  @api options;
  @api required;
  @api value;
  hasRendered;

  renderedCallback() {
    if (this.hasRendered) return;

    const select = this.template.querySelector("select");
    select.value = this.value;
    this.hasRendered = true;
  }

  handleChange(event) {
    const value = event.target.value;
    const id = event.target.dataset.id;
    const evt = new CustomEvent("change", { detail: { id, value } });
    this.dispatchEvent(evt);
  }
}
