import { LightningElement, wire, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getSiteUrl from "@salesforce/apex/GetSite.getSiteUrl";

const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
const SUCCESS_TITLE = "Success";
const SUCCESS_MESSAGE = "File deleted";
const SUCCESS_VARIANT = "success";

const defaultColumns = [
  {
    label: "Filename",
    type: "filename",
    fieldName: "Id",
    typeAttributes: {
      filename: { fieldName: "Title" }
    },
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Extension",
    fieldName: "FileType",
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Size",
    fieldName: "ContentSize",
    type: "fileSize",
    typeAttributes: {
      size: { fieldName: "ContentSize" }
    },
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Type",
    fieldName: "Type",
    type: "badge",
    typeAttributes: {
      id: { fieldName: "Id" },
      label: { fieldName: "Type" }
    },
    hideDefaultActions: true
  },
  {
    label: "Uploaded By",
    type: "user",
    fieldName: "Owner",
    typeAttributes: {
      id: { fieldName: "OwnerId" },
      name: { fieldName: "Owner" },
      photo: { fieldName: "OwnerSmallPhotoUrl" }
    },
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Modified On",
    fieldName: "ContentModifiedDate",
    type: "date",
    typeAttributes: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    },
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "",
    type: "preview",
    fieldName: "Id",
    typeAttributes: {
      id: { fieldName: "Id" }
    },
    hideDefaultActions: true,
    fixedWidth: 35
  }
];

export default class FileTableContainer extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @api deleteColumn;
  @api downloadColumn;
  @api editColumn;
  @api allowedUploadTypes;
  @track filteredFiles = [];
  @track availableSections;
  @track activeSections;
  _recordId;
  _tableData = [];
  searchTerm;
  isExperienceCloud;

  previewContentVersionId;
  previewContentDocumentId;

  recordToDelete;
  recordToEdit;

  @api
  get tableData() {
    return this._tableData;
  }
  set tableData(value) {
    this._tableData = value ? value : [];

    this.applyFilter();
  }

  // Refresh apex query
  refresh() {
    const evt = new CustomEvent("refreshdata");
    this.dispatchEvent(evt);
  }

  @wire(getSiteUrl)
  wiredSite({ error, data }) {
    if (data) {
      this.isExperienceCloud = true;
    }

    if (error) {
      console.error("error", error);
    }
  }

  // Add Edit, Delete, and Download columns according to props
  get columns() {
    const cols = [...defaultColumns];

    if (this.downloadColumn) {
      cols.push({
        label: "",
        type: "download",
        fieldName: "Id",
        typeAttributes: {
          id: { fieldName: "Id" }
        },
        hideDefaultActions: true,
        fixedWidth: 35
      });
    }

    if (this.editColumn) {
      cols.push({
        label: "",
        type: "edit",
        fieldName: "Id",
        typeAttributes: {
          id: { fieldName: "Id" }
        },
        hideDefaultActions: true,
        fixedWidth: 35
      });
    }

    if (this.deleteColumn) {
      cols.push({
        label: "",
        type: "delete",
        fieldName: "Id",
        typeAttributes: {
          id: { fieldName: "Id" }
        },
        hideDefaultActions: true,
        fixedWidth: 35
      });
    }

    return cols;
  }

  get fileCount() {
    return this.filteredFiles && this._tableData.length
      ? this._tableData.length
      : 0;
  }

  // Open custom filePreview component for Experience Cloud as native file preview is not yet available for LWC
  // Refer to https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_open_files for more information
  handlePreview(event) {
    const id = event.detail.id;
    const file = this._tableData.find((row) => row.Id === id);

    if (!file) return;

    if (this.isExperienceCloud) {
      this.previewContentVersionId = file.Id;
      this.previewContentDocumentId = file.ContentDocumentId;
      this.previewType = file.FileType;

      this.handleShowPreview();
    } else {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "filePreview"
        },
        state: {
          selectedRecordId: file.ContentDocumentId
        }
      });
    }
  }

  // Returns different download url for Lightning vs Experience Cloud
  handleDownload(event) {
    const id = event.detail.id;
    const file = this._tableData.find((row) => row.Id === id);

    if (!file) return;

    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: this.isExperienceCloud
          ? window.location.origin +
            `/sfc/servlet.shepherd/document/download/${file.ContentDocumentId}`
          : `/sfc/servlet.shepherd/document/download/${file.ContentDocumentId}?operationContext=S1`
      }
    });
  }

  // Open modal allowing user to edit file type
  handleEdit(event) {
    const id = event.detail.id;
    const file = this._tableData.find((row) => row.Id === id);

    if (!file) return;

    const modal = this.template.querySelector(`[data-id="edit"]`);
    this.recordToEdit = { ...file };
    modal.show();
  }

  handleHideEdit() {
    const modal = this.template.querySelector(`[data-id="edit"]`);
    modal.hide();
  }

  // Display confirmation modal to user before deleting
  handleDelete(event) {
    const id = event.detail.id;
    const file = this._tableData.find((row) => row.Id === id);

    if (!file) return;

    if (!this.deleteColumn) return;
    this.recordToDelete = file.ContentDocumentId;

    const modal = this.template.querySelector(`[data-id="delete"]`);
    modal.show();
  }

  // Handle dialog confirm event
  async handleConfirmDelete() {
    const recordId = this.recordToDelete;

    // Hide modal
    const modal = this.template.querySelector(`[data-id="delete"]`);

    modal.hide();

    try {
      // Delete record
      await deleteRecord(recordId);

      // Display toast
      const evt = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: SUCCESS_MESSAGE,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);

      this.recordToDelete = null;

      // Refresh file list
      // await this.refresh();
      this.refresh();
    } catch (error) {
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        message: "Error deleting record",
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(evt);

      this.recordToDelete = null;
    }
  }

  handleCancelDelete() {
    const modal = this.template.querySelector(`[data-id="delete"]`);
    modal.hide();
  }

  handleTitleChange({ detail: { value } }) {
    this.recordToEdit.Title = value;
  }

  handleTypeChange({ detail: { value } }) {
    this.recordToEdit.Type = value;
  }

  handleSaveEdit() {
    const evt = new CustomEvent("saveedit", {
      detail: {
        Id: this.recordToEdit.Id,
        Title: this.recordToEdit.Title,
        Type: this.recordToEdit.Type
      }
    });
    this.dispatchEvent(evt);

    const modal = this.template.querySelector(`[data-id="edit"]`);
    modal.hide();

    this.recordToEdit = null;
  }

  handleInputChange(event) {
    const search = event.target.value;
    this.searchTerm = search ? search.trim() : "";
    this.applyFilter();
  }

  // Filter files by title
  // Group files by Type
  applyFilter() {
    this.availableSections = this._tableData
      .reduce((sections, file) => {
        const type = file.Type ? file.Type : "Other";

        if (!sections.includes(type)) {
          sections.push(type);
        }

        return sections;
      }, [])
      .sort();

    //TODO delete
    this.activeSections = [...this.availableSections];

    const filesByType = this._tableData
      .filter((file) => {
        if (!this.searchTerm || this.searchTerm.trim().length === 0) {
          return true;
        }

        const re = new RegExp(this.escapeRegExp(this.searchTerm), "i");
        return file.Title.match(re);
      })
      .reduce((group, file) => {
        const key = file.Type ? file.Type : "Other";

        if (Object.prototype.hasOwnProperty.call(group, key)) {
          group[key].push(file);
        } else {
          group[key] = [file];
        }

        return group;
      }, {});

    this.filteredFiles = this.availableSections.map((section) => {
      return {
        data: filesByType[section] ? filesByType[section] : [],
        type: section,
        label: `${section} (${
          filesByType[section] ? filesByType[section].length : 0
        })`,
        class:
          filesByType[section] && filesByType[section].length > 0 ? "" : "empty"
      };
    });
  }

  escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  handleSectionToggle(event) {
    this.activeSections = event.detail.openSections;
  }

  handleShowPreview() {
    const modal = this.template.querySelector(`[data-id="preview"]`);
    modal.show();
  }

  handleHidePreview() {
    const modal = this.template.querySelector(`[data-id="preview"]`);
    modal.hide();
  }
}
