import { LightningElement, api, track, wire } from "lwc";
import updateVersions from "@salesforce/apex/FileUploadController.updateVersions";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENT_VERSION_OBJECT from "@salesforce/schema/ContentVersion";
import TYPE_FIELD from "@salesforce/schema/ContentVersion.Type__c";

export default class UploadFilesByType extends LightningElement {
  @api recordId;
  @api fileExtensions;
  @api table;
  @api deleteColumn;
  @api downloadColumn;
  @api editColumn;
  @track filesUploaded = [];
  @track fileQueue = [];
  formValid = true;

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

  async handleCloseModal() {
    // validate form
    this.formValid = this.isValid();
    if (!this.formValid) return;

    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    try {
      await this.handleTypeUpdate(this.fileQueue);
    } catch (error) {
      console.log("handleTypeUpdate error", error);
    }
  }

  handleTypeChange({ detail: { id, value } }) {
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

    this.fileQueue = files;
    this.handleOpenModal();
  }

  handleTypeUpdate(files) {
    updateVersions({ contentVersions: files })
      .then(() => {
        // reset file queue
        this.fileQueue = [];

        // add to uploaded file list
        this.filesUploaded.push(...files);

        if (this.table) {
          // Refresh the fileTableContainer apex query
          this.template.querySelector("c-file-table-container").refresh();
        }
      })
      .catch((error) => {
        console.log("updateVersions error", error);
      });
  }
}
