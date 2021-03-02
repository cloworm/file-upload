import { LightningElement, api, track, wire } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";
import finalizeVersion from "@salesforce/apex/FileUploadController.finalizeVersion";
import updateVersionTypes from "@salesforce/apex/FileUploadController.updateVersionTypes";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENT_VERSION_OBJECT from "@salesforce/schema/ContentVersion";
import TYPE_FIELD from "@salesforce/schema/ContentVersion.Type__c";

const CHUNK_SIZE = 750000;

export default class UploadFilesByType extends LightningElement {
  @api recordId;
  @track filesUploaded = [];
  @track fileQueue = [];
  formValid = true;

  // Component Properties
  @api fileExtensions;
  @api grid;
  @api deleteColumn;
  @api downloadColumn;

  types = [];

  @wire(getObjectInfo, { objectApiName: CONTENT_VERSION_OBJECT })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: TYPE_FIELD
  })
  wiredTypes({ error, data }) {
    if (data) {
      this.types = data.values;
    }

    if (error) {
      console.error("error", error);
    }
  }

  handleLoad(event) {
    const file = event.detail;
    this.fileQueue.push({ ...file });

    this.handleOpenModal();
  }

  // Create a ContentVersion and attach file to the given recordId using the provided base64 and filename
  handleUpload(file) {
    let fromPos = 0;
    let toPos = Math.min(file.base64.length, fromPos + CHUNK_SIZE);

    this.filesUploaded.push(file);

    this.uploadChunk(file, fromPos, toPos);
  }

  uploadChunk(file, fromPos, toPos) {
    const chunk = file.base64.substring(fromPos, toPos);

    return uploadFile({
      ...file,
      versionId: file.Id,
      chunk
    })
      .then(async (result) => {
        file.Id = result.Id;
        fromPos = toPos;
        toPos = Math.min(file.base64.length, fromPos + CHUNK_SIZE);

        if (fromPos < toPos) {
          this.uploadChunk(file, fromPos, toPos);
        } else {
          const final = await finalizeVersion({
            contentVersionId: file.Id,
            recordId: this.recordId
          });
          const idx = this.getFileIdxById(file.id);
          this.filesUploaded[idx].Id = final.Id;
          this.filesUploaded[idx].ContentDocumentId = final.ContentDocumentId;
          this.filesUploaded[idx].FileType = final.FileType;

          if (this.grid) {
            // Refresh the file grid component
            this.template.querySelector("c-file-grid-container").refresh();
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        const idx = this.getFileIdxById(file.id);
        this.filesUploaded[idx].error = "Server error";
      });
  }

  getFileIdxById(id) {
    return this.filesUploaded.findIndex((file) => file.id === id);
  }

  get hasFiles() {
    return this.filesUploaded && this.filesUploaded.length > 0;
  }

  handleOpenModal() {
    // const modal = this.template.querySelector("c-modal");
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.show();
  }

  handleCancelModal() {
    // const modal = this.template.querySelector("c-modal");
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    this.files = [];
  }

  handleCloseModal() {
    // validate form

    if (!this.formValid) return;

    // const modal = this.template.querySelector("c-modal");
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    // upload files
    // this.fileQueue.forEach((file) => {
    //   if (file.error) return;

    //   // this.handleTypeUpdate()
    //   // this.handleUpload(file);
    // });
    this.handleTypeUpdate(this.fileQueue)
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  handleTypeChange({ detail: { id, value } }) {
    console.log("handleTypeChange", id, value);
    // set Type__c
    this.fileQueue = this.fileQueue.map((file) => {
      if (file.Id === id) {
        file.Type__c = value;
      }

      return file;
    });
  }

  // Manually trigger form validation
  isValid() {
    const form = this.template.querySelector("form");
    const validity = form.reportValidity();
    return validity;
  }

  handleUploaded(event) {
    const files = event.detail.files;
    console.log("files", JSON.parse(JSON.stringify(files)));
    console.log("handleUploaded", files.length);

    // this.fileQueue.push(...files);
    this.fileQueue = files;

    this.handleOpenModal();
  }

  handleTypeUpdate(files) {
    updateVersionTypes({ contentVersions: files })
      .then((response) => {
        console.log("updateVersionTypes response", response);

        // reset file queue
        this.fileQueue = [];

        if (this.grid) {
          // Refresh the file grid component
          this.template.querySelector("c-file-grid-container").refresh();
        }
      })
      .catch((error) => {
        console.log("updateVersionTypes error", error);
      });
  }
}
