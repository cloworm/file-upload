import { LightningElement, wire, api } from "lwc";

export default class PreviewButton extends LightningElement {
  @api rowId;

  firePreviewRow() {
    const evt = new CustomEvent("rowpreview", {
      composed: true,
      bubbles: true,
      detail: { id: this.rowId }
    });
    this.dispatchEvent(evt);
  }
}
