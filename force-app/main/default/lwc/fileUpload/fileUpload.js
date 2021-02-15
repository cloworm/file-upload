import { LightningElement, api, track } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

// TO DO check file size
// TO DO send data in chunks
// TO DO tell user what file type they can upload

export default class FileUpload extends LightningElement {
  @api recordId;

  // Admin Config properties
  @api allowImages;
  @api allowVideos;
  @api showGrid;

  allowMultiple = true;
  uploadIcon = "utility:open_folder";
  @track files = [
    {
      id: 2,
      filename: "Vlocity.pdf",
      // ContentDocumentId: "0695Y00000LsOoBQAV",
      type: "application/pdf",
      base64: "",
      recordId: null,
      size: 3500
    },
    {
      id: 1,
      filename: "Vlocity.pdf",
      ContentDocumentId: "0695Y00000LsOoBQAV",
      type: "application/pdf",
      base64: "",
      recordId: null,
      size: 2000
    }
  ];
  isDragging = false;

  // return file types options allowed by admin
  get acceptedFileTypes() {
    const acceptedTypes = [];

    // set allowed types based on properties set by admin
    if (this.allowImages) {
      acceptedTypes.push("image/*");
    }

    if (this.allowVideos) {
      acceptedTypes.push("video/*");
    }

    return acceptedTypes.join(" ");
  }

  handleInputChange(event) {
    this.files = [];
    event.target.files.forEach((file) => this.processFile(file));
  }

  get hasFiles() {
    return this.files && this.files.length > 0;
  }

  processFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      var base64 = reader.result.split(",")[1];
      const fileData = {
        id: this.uniqueID(),
        filename: file.name,
        base64: base64,
        recordId: this.recordId,
        type: file.type,
        ContentDocumentId: null,
        size: file.size
      };
      this.files.push(fileData);

      this.handleUpload(fileData);
    };
    reader.readAsDataURL(file);
  }

  handleUpload({ id, base64, filename, recordId }) {
    uploadFile({ base64, filename, recordId })
      .then((result) => {
        const fileUploadedIdx = this.files.findIndex((file) => file.id === id);
        this.files[fileUploadedIdx].ContentDocumentId = result;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDragging) {
      this.showDropzoneHover();
    }
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.hideDropzoneHover();
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.files = [];

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

  showDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.add("box-animate");
    this.uploadIcon = "utility:opened_folder";
    this.isDragging = true;
  }

  hideDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.remove("box-animate");
    this.uploadIcon = "utility:open_folder";
    this.isDragging = false;
  }
}
