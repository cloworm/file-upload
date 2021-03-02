import { LightningElement, api } from "lwc";
import getVersionInfo from "@salesforce/apex/FileUploadController.getVersionInfo";

export default class FileUpload extends LightningElement {
  @api recordId;
  @api fileExtensions;

  hasRendered;
  isDragging = false;

  renderedCallback() {
    if (this.hasRendered) return;
    this.hasRendered = true;

    const style = document.createElement("style");
    style.innerText = `
      .uploader .slds-file-selector.slds-file-selector_files {
        width: 100%;
      }

      .uploader .slds-file-selector__dropzone {
        width: 100%;
        border: none;
      }

      .uploader .slds-file-selector__body {
        height: 165px;
        justify-content: center;
      }

      .uploader .slds-has-drag-over {
        border: none !important;
        box-shadow: none !important;
      }

      .uploader .slds-form-element__label {
        display: none;
      }

      .uploader slot[interop-primitiveFileDroppableZone_primitiveFileDroppableZone] {
        width: 100%;
      }

      .uploader .slds-has-error .slds-form-element__help {
        text-align: center;
        position: relative;
        top: -30px;
      }
    `;
    this.template.querySelector(".uploader").appendChild(style);
  }

  get hasInvalidConfig() {
    return false;
    // return [...new Set(this.fileExtensions.split(","))].find((extension) => {
    //   // let key = extension.replace(".", "").toLowerCase();
    // });
  }

  // Get list of extensions set by admin in component properties
  get allowedExtensions() {
    // Remove any duplicates
    const uniqueExtensions = [...new Set(this.fileExtensions.split(","))];

    return uniqueExtensions.sort().join(", ");
  }

  // Apply dropzone hover styles ondragenter
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isDragging) {
      console.log("dragenter");
      this.showDropzoneHover();
    }
  }

  // Remove dropzone hover styles ondragleave
  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("dragleave");

    this.hideDropzoneHover();
  }

  // Get files dropped on dropzone
  // TODO - check mime type
  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("drop");

    this.hideDropzoneHover();
  }

  // Apply dropzone hover styles
  showDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.add("box-animate");
    this.isDragging = true;
  }

  // Remove dropzone hover styles
  hideDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.remove("box-animate");
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
