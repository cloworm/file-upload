import { LightningElement, api } from "lwc";

export default class DownloadButton extends LightningElement {
  @api rowId;

  fireDownloadRow() {
    const evt = new CustomEvent("rowdownload", {
      composed: true,
      bubbles: true,
      detail: { id: this.rowId }
    });
    this.dispatchEvent(evt);
  }
}
