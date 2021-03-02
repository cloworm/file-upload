import { LightningElement, api } from "lwc";
import getVersionInfo from "@salesforce/apex/FileUploadController.getVersionInfo";

const extensionToMimeType = {
  csv: "text/csv",
  doc: "application/msword",
  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  dot: "application/msword",
  ics: "text/calendar",
  mdb: "application/vnd.ms-access",
  pdf: "application/pdf",
  pps: "application/vnd.ms-powerpoint",
  ppsx:
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  ppt: "application/vnd.ms-powerpoint",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  rtf: "application/rtf",
  sxc: "application/vnd.sun.xml.calc",
  sxi: "application/vnd.sun.xml.impress",
  sxw: "application/vnd.sun.xml.writer",
  txt: "text/plain",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  tif: "image/tiff",
  tiff: "image/tiff",
  vsd: "application/vnd.visio",
  mp3: "audio/mpeg",
  ogg: "application/ogg",
  wav: "audio/wav",
  mov: "video/quicktime",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  zip: "application/zip",
  css: "text/css",
  htm: "text/html",
  html: "text/html",
  js: "text/javascript",
  xml: "	text/xml",
  xsl: "text/xsl",
  xslt: "application/xslt+xml"
};

// TO DO check file size
// TO DO send data in chunks
export default class FileUpload extends LightningElement {
  @api recordId;

  // Component Properties
  // TO DO convert to getter & setter, getter returns an array
  @api fileExtensions;

  uploadIcon = "utility:open_folder";
  extensionToMimeType = extensionToMimeType;
  isDragging = false;

  get hasInvalidConfig() {
    return [...new Set(this.fileExtensions.split(","))].find((extension) => {
      let key = extension.replace(".", "").toLowerCase();
      return !this.extensionToMimeType[key];
    });
  }

  // Get list of extensions set by admin in component properties
  get allowedExtensions() {
    // Remove any duplicates
    const uniqueExtensions = [...new Set(this.fileExtensions.split(","))];

    return uniqueExtensions.sort().join(", ");
  }

  // Use fileExtensions to get list of allowed mime types
  get acceptedMimeTypes() {
    if (!this.fileExtensions) return "";

    return this.fileExtensions
      .split(",")
      .map((extension) => {
        let key = extension.replace(".", "");
        return this.extensionToMimeType[key];
      })
      .join(",");
  }

  handleInputChange(event) {
    [...event.target.files].forEach((file) => this.processFile(file));
  }

  // Read file contents and convert to base64 encoded string
  processFile(file) {
    const reader = new FileReader();

    reader.onload = () => {
      var base64 = reader.result.split(",")[1];
      const fileData = {
        id: this.uniqueID(),
        filename: file.name,
        base64,
        recordId: this.recordId,
        type: file.type,
        ContentDocumentId: null,
        size: file.size,
        error: null
      };

      // Check if file extension is allowed
      const extension = this.getFileExtension(file.name);
      if (
        !file.type ||
        !this.fileExtensions.split(",").includes("." + extension)
      ) {
        // Display error if not an allowed type
        fileData.error = "File extension is not allowed";
      }

      const evt = new CustomEvent("load", { detail: fileData });
      this.dispatchEvent(evt);
    };

    reader.readAsDataURL(file);
  }

  getFileExtension(filename) {
    return filename.split(".").pop();
  }

  // Apply dropzone hover styles ondragenter
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDragging) {
      this.showDropzoneHover();
    }
  }

  // Remove dropzone hover styles ondragleave
  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideDropzoneHover();
  }

  // Get files dropped on dropzone
  // TODO - check mime type
  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideDropzoneHover();

    [...event.dataTransfer.files].forEach((file) => {
      this.processFile(file);
    });
  }

  uniqueID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  // Apply dropzone hover styles
  showDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.add("box-animate");
    this.uploadIcon = "utility:opened_folder";
    this.isDragging = true;
  }

  // Remove dropzone hover styles
  hideDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.remove("box-animate");
    this.uploadIcon = "utility:open_folder";
    this.isDragging = false;
  }

  handleUploadFinished(event) {
    const files = event.detail.files;

    if (!files || files.length === 0) return;

    console.log("files uploaded", JSON.parse(JSON.stringify(files)));

    getVersionInfo({
      contentVersionIds: files.map((file) => file.contentVersionId)
    })
      .then((response) => {
        console.log("response", response);
        const evt = new CustomEvent("uploaded", {
          detail: { files: response }
        });
        this.dispatchEvent(evt);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}
