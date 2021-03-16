import { LightningElement, wire, api } from "lwc";

export default class EditButton extends LightningElement {
  @api rowId;

  fireEditRow() {
    const evt = new CustomEvent("rowedit", {
      composed: true,
      bubbles: true,
      detail: { id: this.rowId }
    });
    this.dispatchEvent(evt);
  }
}
