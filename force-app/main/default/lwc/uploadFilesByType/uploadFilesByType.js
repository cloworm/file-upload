import { LightningElement, api, track, wire } from "lwc";
import uploadFile from "@salesforce/apex/FileUploadController.uploadFile";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENT_VERSION_OBJECT from "@salesforce/schema/ContentVersion";
import TYPE_FIELD from "@salesforce/schema/ContentVersion.Type__c";
import getVersionData from "@salesforce/apex/GetVersionData.getData";

export default class UploadFilesByType extends LightningElement {
  @api recordId;
  @api isExperienceCloud;
  @track filesUploaded = [
    // {
    //   id: 1,
    //   filename: "test.png",
    //   base64: "12345",
    //   recordId: this.recordId,
    //   type: "png",
    //   ContentDocumentId: null,
    //   size: 1000,
    //   error: null,
    //   Type: "Category A"
    // },
    // {
    //   id: 2,
    //   filename: "test file.pdf",
    //   base64: "12345",
    //   recordId: this.recordId,
    //   type: "pdf",
    //   ContentDocumentId: "15235",
    //   size: 3502349,
    //   error: null,
    //   Type: "Category B"
    // }
  ];
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
    this.fileQueue.push(file);
    this.handleOpenModal();
  }

  // Create a ContentVersion and attach file to the given recordId using the provided base64 and filename
  handleUpload(file) {
    this.filesUploaded.push(file);
    console.log("uploading", JSON.parse(JSON.stringify(file)));
    uploadFile(file)
      .then((result) => {
        const idx = this.getFileIdxById(file.id);
        this.filesUploaded[idx].ContentDocumentId = result;

        if (this.grid) {
          // Refresh the file grid component
          this.template.querySelector("c-file-grid-container").refresh();
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
    this.fileQueue.forEach((file) => this.handleUpload(file));

    // reset file queue
    this.fileQueue = [];
  }

  handleTypeChange({ detail: { id, value } }) {
    // set type
    this.fileQueue = this.fileQueue.map((file) => {
      if (file.id === id) {
        file.type = value;
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
}
