import { LightningElement, api } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";

export default class FileUpload extends LightningElement {
  @api recordId;
  @api prop1;
  acceptedFileTypes = "image/*";
  allowMultiple = false;
  fileData;

  handleInputChange(event) {
    this.fileData = null;

    const file = event.target.files[0];
    console.log("files", file);

    const reader = new FileReader();
    reader.onload = () => {
      var base64 = reader.result.split(",")[1];
      this.fileData = {
        filename: file.name,
        base64: base64,
        recordId: this.recordId,
        type: file.type
      };
      console.log(this.fileData);

      this.handleUpload(this.fileData);
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

  get iconName() {
    switch (this.fileData.type) {
      case "image/png":
        return "doctype:image";

      default:
        return "doctype:unknown";
    }
  }
}
