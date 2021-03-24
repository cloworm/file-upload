import { LightningElement, api, track, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import getViewDefinition from "@salesforce/apex/UploadFilesByMetadataController.getViewDefinition";
import getUploadDefinition from "@salesforce/apex/UploadFilesByMetadataController.getUploadDefinition";
import getFiles from "@salesforce/apex/FileTableByMetadataController.getFiles";
import updateVersions from "@salesforce/apex/FileUploadController.updateVersions";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Success";
const SUCCESS_VARIANT = "success";

import USER_ID from "@salesforce/user/Id";
import PROFILE_FIELD from "@salesforce/schema/User.Profile.Name";

export default class UploadFilesByMetadata extends LightningElement {
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

  // access rules
  @api uploadTypeName;
  @api viewTypeName;
  @api lob;
  allowedViewTypes = [];
  allowedUploadTypes = [];

  _badgeColor;
  formValid = true;
  hasRendered;
  tableData = [];
  types = [];

  @wire(getRecord, { recordId: USER_ID, fields: [PROFILE_FIELD] })
  wiredUser({ error, data }) {
    if (data) {
      const profile = getFieldValue(data, PROFILE_FIELD);
      console.log("profile", profile);
      this.getAccessRules(profile);
    }
    if (error) {
      console.error("wiredUser error", error);
    }
  }

  async getAccessRules(profile) {
    try {
      const viewDefinition = await getViewDefinition({
        Name: this.viewTypeName,
        Profile: profile,
        LOB: this.lob
      });
      this.allowedViewTypes = viewDefinition.Type__c.split(";");
      console.log("view", JSON.parse(JSON.stringify(this.allowedViewTypes)));

      const uploadDefinition = await getUploadDefinition({
        Name: this.uploadTypeName,
        Profile: profile,
        LOB: this.lob
      });
      this.allowedUploadTypes = uploadDefinition.Type__c.split(";").map(
        (val) => {
          return {
            label: val,
            value: val
          };
        }
      );
      console.log(
        "upload",
        JSON.parse(JSON.stringify(this.allowedUploadTypes))
      );

      this.getFiles();
    } catch (error) {
      console.error("getAccessRules error", error);
    }
  }

  getFiles() {
    return getFiles({
      recordId: this.recordId,
      types: this.allowedViewTypes
    })
      .then((data) => {
        if (!data) return;
        this.tableData = data.map((row) => {
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
      })
      .catch((error) => {
        console.error("getFiles error", error);
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

  get hasFiles() {
    return this.filesUploaded && this.filesUploaded.length > 0;
  }

  handleRefresh() {
    return this.getFiles();
  }

  handleOpenModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.show();
  }

  async handleCancelModal() {
    const modal = this.template.querySelector(`[data-id="types"]`);
    modal.hide();

    // Refresh the fileTableContainer apex query
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
        message: `File ${Title} updated`,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);
    } catch (error) {
      console.log("handleSaveEdit error", error);
    }
  }
}
