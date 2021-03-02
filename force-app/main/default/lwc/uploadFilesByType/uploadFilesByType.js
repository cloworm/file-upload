import { LightningElement, api, track, wire } from "lwc";
import updateVersionTypes from "@salesforce/apex/FileUploadController.updateVersionTypes";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENT_VERSION_OBJECT from "@salesforce/schema/ContentVersion";
import TYPE_FIELD from "@salesforce/schema/ContentVersion.Type__c";

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

  get hasFiles() {
    return this.filesUploaded && this.filesUploaded.length > 0;
  }

  handleOpenModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.show();
  }

  handleCancelModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    this.files = [];
  }

  handleCloseModal() {
    // validate form
    if (!this.formValid) return;

    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

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
