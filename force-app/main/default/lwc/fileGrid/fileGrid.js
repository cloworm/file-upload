import { LightningElement, wire, api } from "lwc";
import getFiles from "@salesforce/apex/FileGridController.getFiles";

const columns = [
  { label: "Title", fieldName: "Title" },
  { label: "Size (bytes)", fieldName: "ContentSize" },
  { label: "Type", fieldName: "FileType" },
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
    }
  }
];

export default class FileGrid extends LightningElement {
  @api record;
  files;
  columns = columns;

  @wire(getFiles, { id: "$record" })
  getApexFiles({ error, data }) {
    if (data) {
      this.files = data;
      console.log("got data", data);
    }

    if (error) {
      console.error("error");
    }
  }

  get fileCount() {
    return this.files && this.files.length ? this.files.length : 0;
  }
}
