import { LightningElement, api, track, wire } from "lwc";
import updateVersions from "@salesforce/apex/FileUploadController.updateVersions";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENT_VERSION_OBJECT from "@salesforce/schema/ContentVersion";
import TYPE_FIELD from "@salesforce/schema/ContentVersion.Type__c";
import getFiles from "@salesforce/apex/FileTableController.getFiles";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Success";
const SUCCESS_VARIANT = "success";

export default class UploadFilesByType extends LightningElement {
  @api recordId;
  @api fileExtensions;
  @api table;
  @api deleteColumn;
  @api downloadColumn;
  @api editColumn;
  @track filesUploaded = [];
  @track fileQueue = [];

  // Theming
  @api badgeColor;
  @api badgeTextColor;
  @api editIconColor;
  @api previewIconColor;
  @api downloadIconColor;
  @api deleteIconColor;
  @api uploaderOutlineColor;
  @api uploaderBackgroundColor;
  @api boldFilename;

  _badgeColor;
  formValid = true;
  hasRendered;
  tableData;
  wiredFilesResult;

  @wire(getFiles, { recordId: "$recordId" })
  wiredFiles(result) {
    this.wiredFilesResult = result;

    if (!result.data) return;
    this.tableData = result.data.map((row) => {
      const file = {
        ...row,
        FileType: row.ContentDocument?.FileType,
        Title: row.ContentDocument?.Title,
        ContentModifiedDate: row.ContentDocument?.ContentModifiedDate,
        Owner: row.Owner?.Name,
        OwnerSmallPhotoUrl: row.Owner?.SmallPhotoUrl,
        ContentSize: row.ContentDocument?.ContentSize,
        Type: row.Type__c
      };

      return file;
    });
  }

  renderedCallback() {
    if (this.hasRendered) return;

    const el = this.template.querySelector(".gerent-file-upload");
    if (el) {
      el.style.setProperty(
        "--gerent-file-upload-weight",
        this.boldFilename ? 700 : 500
      );
      el.style.setProperty("--sds-c-badge-color-background", this.badgeColor);
      el.style.setProperty("--sds-c-badge-text-color", this.badgeTextColor);
      el.style.setProperty("--gerent-delete-color", this.deleteIconColor);
      el.style.setProperty("--gerent-edit-color", this.editIconColor);
      el.style.setProperty("--gerent-preview-color", this.previewIconColor);
      el.style.setProperty("--gerent-download-color", this.downloadIconColor);
      el.style.setProperty(
        "--gerent-uploader-background-color",
        this.uploaderBackgroundColor
      );
      el.style.setProperty(
        "--gerent-uploader-border-color",
        this.uploaderOutlineColor
      );
    }

    this.hasRendered = true;
  }

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

  handleRefresh() {
    refreshApex(this.wiredFilesResult);
  }

  handleOpenModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.show();
  }

  async handleCancelModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    // Refresh the fileTableContainer apex query
    // this.template.querySelector("c-file-table-container").refresh();
    await this.handleRefresh();

    // Move files to uploaded list
    this.filesUploaded.push(...this.fileQueue);

    // Clear file queue
    this.fileQueue = [];
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
      .then(async () => {
        // reset file queue
        this.fileQueue = [];

        // add to uploaded file list
        this.filesUploaded.push(...files);

        if (this.table) {
          // Refresh the fileTableContainer apex query
          // this.template.querySelector("c-file-table-container").refresh();
          await this.handleRefresh();
        }
      })
      .catch((error) => {
        console.log("updateVersions error", error);
      });
  }

  async handleSaveEdit({ detail: { Id, Title, Type } }) {
    try {
      const version = {
        Id,
        Title,
        Type__c: Type
      };
      await updateVersions({ contentVersions: [version] });

      // Refresh apex query
      await this.handleRefresh();

      const evt = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: `File ${this.recordToEdit.Title} updated`,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);
    } catch (error) {
      console.log("handleSaveEdit error", error);
    }
  }
}
