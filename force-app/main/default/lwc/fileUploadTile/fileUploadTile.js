import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getSiteUrl from "@salesforce/apex/GetSite.getSiteUrl";

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
  isExperienceCloud;
  previewContentVersionId;
  previewContentDocumentId;
  previewType;

  @wire(getSiteUrl)
  wiredSite({ error, data }) {
    if (data) {
      this.isExperienceCloud = true;
    }

    if (error) {
      console.error("error", error);
    }
  }

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
    if (this.isExperienceCloud) {
      console.log("FILE", JSON.parse(JSON.stringify(this.file)));
      this.previewContentVersionId = this.file.Id;
      this.previewContentDocumentId = this.file.ContentDocumentId;
      this.previewType = this.file.FileType;

      this.handleShowPreview();
    } else {
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

  handleShowPreview() {
    const modal = this.template.querySelector(`[data-id="preview"]`);
    modal.show();
  }

  handleHidePreview() {
    const modal = this.template.querySelector(`[data-id="preview"]`);
    modal.hide();
  }
}
