import { LightningElement, api, track } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

// TO DO check file size
// TO DO send data in chunks
// TO DO tell user what file type they can upload

export default class FileUpload extends LightningElement {
  @api recordId;
  @api prop1;
  acceptedFileTypes = "image/*";
  allowMultiple = true;
  @track files = [
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

  handleInputChange(event) {
    this.files = [];

    event.target.files.forEach((file) => this.processFile(file));
  }

  get hasFiles() {
    console.log("hasFiles", this.files && this.files.length > 0);
    return this.files && this.files.length > 0;
  }

  processFile(file) {
    console.log("processing file!", file);

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
      console.log(fileData);

      this.handleUpload(fileData);
    };
    reader.readAsDataURL(file);
  }

  handleUpload({ id, base64, filename, recordId }) {
    uploadFile({ base64, filename, recordId })
      .then((result) => {
        console.log("ContentDocumentId", result);
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
      console.log("animation start");
      const dropzone = this.template.querySelector("[data-id=dropzone]");
      dropzone.classList.add("box-animate");
      console.log("added box-animate", dropzone.classList);
    }

    this.isDragging = true;
  }

  handleDragLeave(event) {
    console.log("drag leave");
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.files = [];

    console.log("dropped!");
    console.log("files", ...event.dataTransfer.files);

    const dropzone = this.template.querySelector("[data-id=dropzone]");
    // this.log("dropzone", dropzone);
    dropzone.classList.remove("box-animate");
    console.log("removed drag", dropzone.classList);
    this.isDragging = false;
    console.log("animation end");
    console.log("files type", typeof event.dataTransfer.files);
    [...event.dataTransfer.files].forEach((file) => {
      console.log("file...", file);
      this.processFile(file);
    });
  }

  uniqueID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  }
}
