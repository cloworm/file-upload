import { LightningElement, api, track } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

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
  @api grid;
  @api deleteColumn;
  @api downloadColumn;

  uploadIcon = "utility:open_folder";
  extensionToMimeType = extensionToMimeType;
  @track files = [
    // {
    //   id: 2,
    //   filename: "Vlocity.pdf",
    //   // ContentDocumentId: "0695Y00000LsOoBQAV",
    //   type: "application/pdf",
    //   base64: "",
    //   recordId: null,
    //   size: 3500,
    //   error: null
    // },
    // {
    //   id: 1,
    //   filename: "Vlocity.pdf",
    //   ContentDocumentId: "0695Y00000LsOoBQAV",
    //   type: "application/pdf",
    //   base64: "",
    //   recordId: null,
    //   size: 2000,
    //   error: null
    // },
    // {
    //   id: 3,
    //   filename: "Test.xls",
    //   ContentDocumentId: null,
    //   type: "application/pdf",
    //   base64: "",
    //   recordId: null,
    //   size: 2000,
    //   error: "Server error"
    // }
  ];
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

  get hasFiles() {
    return this.files && this.files.length > 0;
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

      // Add to uploaded file list
      this.files.push(fileData);

      // Upload file
      if (!fileData.error) {
        this.handleUpload(fileData);
      }
    };

    reader.readAsDataURL(file);
  }

  getFileExtension(filename) {
    return filename.split(".").pop();
  }

  // Create a ContentVersion and attach file to the given recordId using the provided base64 and filename
  handleUpload({ id, base64, filename, recordId }) {
    uploadFile({ base64, filename, recordId })
      .then((result) => {
        const idx = this.getFileIdxById(id);
        this.files[idx].ContentDocumentId = result;

        if (this.grid) {
          // Refresh the file grid component
          this.template.querySelector("c-file-grid").refresh();
        }
      })
      .catch((error) => {
        console.log("error", error);
        const idx = this.getFileIdxById(id);
        this.files[idx].error = "Server error";
      });
  }

  // Apply dropzone hover styles ondragenter
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDragging) {
      this.showDropzoneHover();
    }
  }

  getFileIdxById(id) {
    return this.files.findIndex((file) => file.id === id);
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

    console.log("files", ...event.dataTransfer.files);

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
}
