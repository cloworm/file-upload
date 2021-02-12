import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class FileUploadTile extends NavigationMixin(LightningElement) {
  @api file;

  get isUploaded() {
    return this.file && this.file.ContentDocumentId;
  }

  get progress() {
    return this.file && this.file.ContentDocumentId ? 100 : 0;
  }

  get iconName() {
    if (!this.file) return "doctype:unknown";

    switch (this.file.type) {
      case "image/png":
        return "doctype:image";

      case "text/csv":
        return "doctype:csv";

      case "application/vnd.ms-excel":
        return "doctype:excel";

      case "application/pdf":
        return "doctype:pdf";

      case "application/vnd.ms-powerpoint":
        return "doctype:ppt";

      case "application/zip":
        return "doctype:zip";

      default:
        return "doctype:unknown";
    }
  }

  handlePreview(event) {
    const recordId = event.currentTarget.dataset.id;
    console.log("handling preview of file with ContentDocumentId", recordId);

    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "filePreview"
      },
      state: {
        selectedRecordId: recordId
      }
    });
  }
}
