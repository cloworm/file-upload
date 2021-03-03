import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getSiteUrl from "@salesforce/apex/GetSite.getSiteUrl";

// Maps FileType to doctype icon
const extensionToMimeType = {
  CSV: "doctype:csv",
  DOC: "doctype:word",
  DOCX: "doctype:word",
  PDF: "doctype:pdf",
  PPT: "doctype:ppt",
  PPTX: "doctype:ppt",
  RTF: "doctype:rtf",
  TXT: "doctype:txt",
  XLS: "doctype:excel",
  XLSX: "doctype:excel",
  BMP: "doctype:image",
  GIF: "doctype:image",
  JPEG: "doctype:image",
  JPG: "doctype:image",
  PNG: "doctype:image",
  TIF: "doctype:image",
  TIFF: "doctype:image",
  VSD: "doctype:visio",
  MP3: "doctype:audio",
  OGG: "doctype:audio",
  WAV: "doctype:audio",
  MOV: "doctype:video",
  MPEG: "doctype:video",
  MPG: "doctype:video",
  ZIP: "doctype:zip",
  HTM: "doctype:html",
  HTML: "doctype:html",
  XML: "doctype:xml"
};

export default class FileUploadTile extends NavigationMixin(LightningElement) {
  @api filename;
  @api contentDocumentId;
  @api tag;
  @api contentVersionId;
  @api filetype;
  isExperienceCloud;
  previewContentVersionId;
  previewContentDocumentId;
  previewType;
  _size;

  @api
  set size(value) {
    this._size = this.formatBytes(value);
  }
  get size() {
    return this._size;
  }

  @wire(getSiteUrl)
  wiredSite({ error, data }) {
    if (data) {
      this.isExperienceCloud = true;
    }

    if (error) {
      console.error("error", error);
    }
  }

  get iconName() {
    console.log("filetype", this.filetype);
    if (!this.filetype) return "doctype:unknown";

    return extensionToMimeType[this.filetype] || "doctype:unknown";
  }

  // Open custom filePreview component for Experience Cloud as native file preview is not yet available for LWC
  // Refer to https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_open_files for more information
  handlePreview(event) {
    if (this.isExperienceCloud) {
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

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
      (bytes / Math.pow(1000, i)).toFixed(2) * 1 +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }
}
