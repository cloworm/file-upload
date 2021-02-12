import { LightningElement, wire, api } from "lwc";
import getFiles from "@salesforce/apex/FileGridController.getFiles";

const columns = [
  { label: "Title", fieldName: "Title" },
  { label: "Size", fieldName: "ContentSize" },
  { label: "FileType", fieldName: "FileType" },
  { label: "Modified On", fieldName: "ContentModifiedDate", type: "date" }
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
}
