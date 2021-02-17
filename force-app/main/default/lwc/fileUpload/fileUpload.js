import { LightningElement, api, track } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

// TO DO check file size
// TO DO send data in chunks
export default class FileUpload extends LightningElement {
  @api recordId;

  // Admin Config properties
  @api acceptedMimeTypes;
  @api showGrid;

  uploadIcon = "utility:open_folder";
  @track files = [
    // {
    //   id: 2,
    //   filename: "Vlocity.pdf",
    //   // ContentDocumentId: "0695Y00000LsOoBQAV",
    //   type: "application/pdf",
    //   base64: "",
    //   recordId: null,
    //   size: 3500
    // },
    // {
    //   id: 1,
    //   filename: "Vlocity.pdf",
    //   ContentDocumentId: "0695Y00000LsOoBQAV",
    //   type: "application/pdf",
    //   base64: "",
    //   recordId: null,
    //   size: 2000
    // }
  ];
  isDragging = false;

  // return file types options allowed by admin
  get acceptedFileTypes() {
    return "images";
  }

  handleInputChange(event) {
    event.target.files.forEach((file) => this.processFile(file));
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
        size: file.size
      };

      // Add to uploaded file list
      this.files.push(fileData);

      // Upload file
      this.handleUpload(fileData);
    };

    reader.readAsDataURL(file);
  }

  // Creates a ContentVersion and attaches file to the given recordId using the provided base64 and filename
  handleUpload({ id, base64, filename, recordId }) {
    uploadFile({ base64, filename, recordId })
      .then((result) => {
        const fileUploadedIdx = this.files.findIndex((file) => file.id === id);
        this.files[fileUploadedIdx].ContentDocumentId = result;

        if (this.showGrid) {
          // Refreshes the file grid component
          this.template.querySelector("c-file-grid").refresh();
        }
      })
      .catch((error) => {
        console.log("error", error);
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

    // Reset uploaded files list
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
