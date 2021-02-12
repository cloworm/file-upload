import { LightningElement, api, track } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

export default class FileUpload extends LightningElement {
  @api recordId;
  @api prop1;
  acceptedFileTypes = "image/*";
  allowMultiple = true;
  @track files = [
    {
      id: this.uniqueID(),
      filename: "Test.csv",
      base64: "test",
      recordId: this.recordId,
      type: "text/csv"
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
        type: file.type
      };
      this.files.push(fileData);
      console.log(fileData);

      this.handleUpload(fileData);
    };
    reader.readAsDataURL(file);
  }

  handleUpload(fileData) {
    uploadFile(fileData)
      .then((result) => {
        console.log("result", result);
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
    console.log("dropped!");
    event.preventDefault();
    event.stopPropagation();
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

  get iconName() {
    switch (this.fileData.type) {
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

  uniqueID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  }
}
