import { LightningElement, wire, api, track } from "lwc";
import getFiles from "@salesforce/apex/FileGridController.getFiles";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
const SUCCESS_TITLE = "Success";
const SUCCESS_MESSAGE = "File deleted";
const SUCCESS_VARIANT = "success";

const columns = [
  {
    label: "Filename",
    fieldName: "Title",
    wrapText: true,
    hideDefaultActions: true
  },
  {
    label: "Size (bytes)",
    fieldName: "ContentSize",
    type: "number",
    wrapText: true,
    hideDefaultActions: true
  },
  {
    label: "Type",
    fieldName: "FileType",
    wrapText: true,
    hideDefaultActions: true
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
    hideDefaultActions: true
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
  },
  {
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
  }
];

export default class FileGrid extends NavigationMixin(LightningElement) {
  @api record;
  files;
  @track filteredFiles;
  columns = columns;
  showDialog = false;
  recordToDelete;
  wiredFilesResult;
  searchTerm;

  @wire(getFiles, { id: "$record" })
  wiredFiles(result) {
    this.wiredFilesResult = result;

    if (!result.data) return;
    this.files = result.data;

    // Set value of filteredFiles
    this.applyFilter();

    if (result.error) {
      console.error("error", result.error);
    }
  }

  // Get # of files
  get fileCount() {
    return this.files && this.files.length ? this.files.length : 0;
  }

  // Handle row actions
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    switch (actionName) {
      case "Preview":
        this.handlePreview(row);
        break;

      case "Delete":
        this.handleDelete(row);
        break;

      default:
        break;
    }
  }

  // Open file in preview window
  handlePreview(file) {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "filePreview"
      },
      state: {
        selectedRecordId: file.Id
      }
    });
  }

  // Display confirmation dialog to user before deleting
  handleDelete(file) {
    this.showDialog = true;
    this.recordToDelete = file.Id;
  }

  // Handle dialog confirm event
  async handleConfirm(event) {
    const recordId = event.detail;
    // Hide dialog
    this.showDialog = false;

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

      // Refresh file list
      await this.refresh();
    } catch (error) {
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.body.message,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(evt);
    }
  }

  // Handle dialog close event
  handleClose() {
    this.showDialog = false;
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
  applyFilter() {
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.filteredFiles = this.files;
      return;
    }

    this.filteredFiles = this.files.filter((file) => {
      return file.Title.match(this.searchTerm, "i");
    });
  }
}
