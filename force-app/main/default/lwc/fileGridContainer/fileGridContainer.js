import { LightningElement, wire, api, track } from "lwc";
import getFiles from "@salesforce/apex/FileGridController.getFiles";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import getSiteUrl from "@salesforce/apex/GetSite.getSiteUrl";

const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
const SUCCESS_TITLE = "Success";
const SUCCESS_MESSAGE = "File deleted";
const SUCCESS_VARIANT = "success";

const defaultColumns = [
  {
    label: "Filename",
    fieldName: "Title",
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Extension",
    fieldName: "FileType",
    wrapText: true,
    hideDefaultActions: true,
    sortable: true,
    fixedWidth: 100
  },
  {
    label: "Size (bytes)",
    fieldName: "ContentSize",
    type: "number",
    wrapText: true,
    hideDefaultActions: true,
    sortable: true
  },
  {
    label: "Type",
    fieldName: "Type__c",
    type: "badge",
    typeAttributes: {
      id: { fieldName: "Id" },
      label: { fieldName: "Type__c" }
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
    type: "button-icon",
    typeAttributes: {
      alternativeText: "Preview",
      title: "Preview",
      name: "Preview",
      variant: "border-filled",
      iconName: "utility:preview",
      iconPosition: "left"
    },
    fixedWidth: 35
  }
];

export default class FileGridContainer extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  @track filteredFiles;
  @track columns = defaultColumns;
  @track availableSections;
  @track activeSections;
  _deleteColumn;
  _recordId;
  _previewColumn;
  files;
  recordToDelete;
  wiredFilesResult;
  searchTerm;
  isExperienceCloud;

  // File Preview
  previewContentVersionId;
  previewContentDocumentId;

  @wire(getFiles, { id: "$recordId" })
  wiredFiles(result) {
    this.wiredFilesResult = result;

    if (!result.data) return;
    this.files = result.data.map((row) => {
      const file = {
        ...row,
        FileType: row.ContentDocument?.FileType,
        Title: row.ContentDocument?.Title,
        ContentModifiedDate: row.ContentDocument?.ContentModifiedDate,
        Owner: row.Owner?.Name,
        OwnerSmallPhotoUrl: row.Owner?.SmallPhotoUrl
      };

      return file;
    });

    // Set value of filteredFiles
    this.applyFilter();
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

  @api
  get deleteColumn() {
    return this._deleteColumn;
  }
  // Show delete column when deleteColumn prop is true
  set deleteColumn(value) {
    this._deleteColumn = value;

    if (value) {
      const hasDelete = this.columns.some((column) => column.name === "delete");
      if (!hasDelete) {
        this.columns.push({
          name: "delete",
          label: "",
          type: "button-icon",
          typeAttributes: {
            alternativeText: "Delete",
            iconClass: "slds-text-color_destructive",
            title: "Delete",
            name: "Delete",
            variant: "border-filled",
            iconName: "utility:delete",
            iconPosition: "left"
          },
          fixedWidth: 35
        });
      }
    } else {
      this.columns = this.columns.filter((col) => col.name !== "delete");
    }
  }

  @api
  get downloadColumn() {
    return this._downloadColumn;
  }
  // Show download column when downloadColumn prop is true
  set downloadColumn(value) {
    this._downloadColumn = value;

    if (value) {
      const hasDownload = this.columns.some(
        (column) => column.name === "download"
      );
      if (!hasDownload) {
        // Insert download column before delete if deleteColumn is true
        this.columns.splice(
          this.deleteColumn ? this.columns.length : this.columns.length - 1,
          0,
          {
            name: "download",
            label: "",
            type: "button-icon",
            typeAttributes: {
              alternativeText: "Download",
              title: "Download",
              name: "Download",
              variant: "border-filled",
              iconName: "utility:download",
              iconPosition: "left"
            },
            fixedWidth: 35
          }
        );
      }
    } else {
      this.columns = this.columns.filter((col) => col.name !== "download");
    }
  }

  // Get # of files
  get fileCount() {
    return this.files && this.files.length ? this.files.length : 0;
  }

  // Handle row actions
  handleRowAction({ detail: { actionName, row } }) {
    switch (actionName) {
      case "Preview":
        this.handlePreview(row);
        break;

      case "Delete":
        this.handleDelete(row);
        break;

      case "Download":
        this.handleDownload(row);
        break;

      default:
        break;
    }
  }

  // Open file in preview window
  handlePreview(file) {
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

  // Download file
  handleDownload(file) {
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

  // Display confirmation modal to user before deleting
  handleDelete(file) {
    if (!this.deleteColumn) return;
    this.recordToDelete = file.ContentDocumentId;

    // const modal = this.template.querySelector("c-modal");
    const modal = this.template.querySelector(`[data-id="delete"]`);

    modal.show();
  }

  // Handle dialog confirm event
  async handleCloseModal() {
    const recordId = this.recordToDelete;

    // Hide modal
    // const modal = this.template.querySelector("c-modal");
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
      await this.refresh();
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

  handleCancelModal() {
    const modal = this.template.querySelector("c-modal");
    modal.hide();
  }

  // Refresh file list
  @api
  async refresh() {
    refreshApex(this.wiredFilesResult);
  }

  handleInputChange(event) {
    const search = event.target.value;
    this.searchTerm = search ? search.trim() : "";
    this.applyFilter();
  }

  // Filter files by title
  // Group files by Type__c
  applyFilter() {
    this.availableSections = this.files
      .reduce((sections, file) => {
        const type = file.Type__c ? file.Type__c : "Uncategorized";

        if (!sections.includes(type)) {
          sections.push(type);
        }

        return sections;
      }, [])
      .sort();

    const filesByType = this.files
      .filter((file) => {
        if (!this.searchTerm || this.searchTerm.trim().length === 0) {
          return true;
        }

        const re = new RegExp(this.escapeRegExp(this.searchTerm), "i");
        return file.Title.match(re);
      })
      .reduce((group, file) => {
        const key = file.Type__c ? file.Type__c : "Uncategorized";

        if (Object.prototype.hasOwnProperty.call(group, key)) {
          group[key].push(file);
        } else {
          group[key] = [file];
        }

        return group;
      }, {});

    this.filteredFiles = this.availableSections.map((section) => {
      return {
        data: filesByType[section],
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
