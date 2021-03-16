import { LightningElement, wire, api } from "lwc";

export default class DeleteButton extends LightningElement {
  @api rowId;

  fireDeleteRow() {
    const evt = new CustomEvent("rowdelete", {
      composed: true,
      bubbles: true,
      detail: { id: this.rowId }
    });
    this.dispatchEvent(evt);
  }
}
