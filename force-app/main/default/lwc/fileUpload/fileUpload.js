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

const BASE_STYLES = `
.slds-file-selector.slds-file-selector_files {
  width: 100%;
  height: 165px;
}

.slds-file-selector__dropzone {
  height: 100%;
  width: 100%;
  background-color: #fafcfe;
  background-image: repeating-linear-gradient(
    0deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    90deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    180deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    270deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  );
  background-size: 1px calc(100% + 14px), calc(100% + 14px) 1px,
    1px calc(100% + 14px), calc(100% + 14px) 1px;
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
  border: none;
}

.slds-file-selector__body {
  height: 165px;
  justify-content: center;
}

slot[interop-primitiveFileDroppableZone_primitiveFileDroppableZone] {
  width: 100%;
}
`;

const HOVER_STYLES = `
.slds-file-selector.slds-file-selector_files {
  width: 100%;
  height: 165px;
}

.slds-file-selector__dropzone {
  height: 100%;
  width: 100%;
  background-color: #fafcfe;
  background-image: repeating-linear-gradient(
    0deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    90deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    180deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  ),
  repeating-linear-gradient(
    270deg,
    #5eb4ff,
    #5eb4ff 7px,
    transparent 7px,
    transparent 14px,
    #5eb4ff 14px
  );
  background-size: 1px calc(100% + 14px), calc(100% + 14px) 1px,
    1px calc(100% + 14px), calc(100% + 14px) 1px;
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
  border: none;
  animation: borderAnimation 0.5s infinite linear;
}

.slds-file-selector__body {
  height: 165px;
  justify-content: center;
}

slot[interop-primitiveFileDroppableZone_primitiveFileDroppableZone] {
  width: 100%;
}

@keyframes borderAnimation {
  from {
    background-position: 0 0, -14px 0, 100% -14px, 0 100%;
  }
  to {
    background-position: 0 -14px, 0 0, 100% 0, -14px 100%;
  }
}
`;

// TO DO check file size
// TO DO send data in chunks
export default class FileUpload extends LightningElement {
  @api recordId;

  // Component Properties
  // TO DO convert to getter & setter, getter returns an array
  @api fileExtensions;
  hasRendered;

  uploadIcon = "utility:open_folder";
  extensionToMimeType = extensionToMimeType;
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
    `;
    this.template.querySelector(".uploader").appendChild(style);
  }

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

    // [...event.dataTransfer.files].forEach((file) => {
    //   this.processFile(file);
    // });
    // let el = this.template.querySelector("lightning-file-upload");
    // console.log("el", JSON.parse(JSON.stringify(el)));
    // let evt = new Event("drop", {
    //   event: { dataTransfer: { files: event.dataTransfer.files } }
    // });
    // el.dispatchEvent(evt);
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
    // this.uploadIcon = "utility:opened_folder";
    // let uploader = this.template.querySelector(".uploader");
    // console.log("uploader!!", JSON.parse(JSON.stringify(uploader)));
    // let children = uploader.children;
    // console.log("children", JSON.parse(JSON.stringify(children)));
    // let style = this.template.querySelector("style");
    // console.log("style", JSON.parse(JSON.stringify(style)));
    this.isDragging = true;
  }

  // Remove dropzone hover styles
  hideDropzoneHover() {
    const dropzone = this.template.querySelector("[data-id=dropzone]");
    dropzone.classList.remove("box-animate");
    // this.uploadIcon = "utility:open_folder";
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
