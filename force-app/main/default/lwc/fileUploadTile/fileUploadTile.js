import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

const extensionToMimeType = {
  csv: "doctype:csv",
  doc: "doctype:word",
  docx: "doctype:word",
  pdf: "doctype:pdf",
  ppt: "doctype:ppt",
  pptx: "doctype:ppt",
  rtf: "doctype:rtf",
  txt: "doctype:txt",
  xls: "doctype:excel",
  xlsx: "doctype:excel",
  bmp: "doctype:image",
  gif: "doctype:image",
  jpeg: "doctype:image",
  jpg: "doctype:image",
  png: "doctype:image",
  tif: "doctype:image",
  tiff: "doctype:image",
  vsd: "doctype:visio",
  mp3: "doctype:audio",
  ogg: "doctype:audio",
  wav: "doctype:audio",
  mov: "doctype:video",
  mpeg: "doctype:video",
  mpg: "doctype:video",
  zip: "doctype:zip",
  htm: "doctype:html",
  html: "doctype:html",
  xml: "doctype:xml"
};

export default class FileUploadTile extends NavigationMixin(LightningElement) {
  @api file;

  get isUploaded() {
    return this.file && this.file.ContentDocumentId;
  }

  get progress() {
    return this.file && this.file.ContentDocumentId ? 100 : 0;
  }

  get iconName() {
    const extension = this.getFileExtension(this.file.filename);
    if (!this.file || !extension) return "doctype:unknown";

    return extensionToMimeType[extension.toLowerCase()] || "doctype:unknown";
  }

  getFileExtension(filename) {
    if (!filename) return "";
    return filename.split(".").pop();
  }

  handlePreview(event) {
    const recordId = event.currentTarget.dataset.id;

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
