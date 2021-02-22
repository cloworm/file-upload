import { LightningElement, api } from "lwc";

export default class FileGrid extends LightningElement {
  @api gridData;
  @api columns;

  get hasData() {
    return this.gridData && this.gridData.length > 0;
  }

  handleRowAction(event) {
    // const actionName = event.detail.action.name;
    // const row = event.detail.row;

    const evt = new CustomEvent("rowaction", { detail: event });
    this.dispatchEvent(evt);
  }
}
