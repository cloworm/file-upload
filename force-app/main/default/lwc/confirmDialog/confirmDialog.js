import { LightningElement, api } from "lwc";

export default class ConfirmDialog extends LightningElement {
  @api show;
  @api title = "Title";
  @api message = "message";
  @api confirmlabel = "Submit";
  @api record;

  handleConfirm() {
    this.dispatchEvent(new CustomEvent("confirm", { detail: this.record }));
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
