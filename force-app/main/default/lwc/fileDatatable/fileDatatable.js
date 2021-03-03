import LightningDatatable from "lightning/datatable";
import badgeColumn from "./badgeColumn.html";
import userColumn from "./userColumn.html";
import fileSizeColumn from "./fileSizeColumn.html";

export default class FileDataTable extends LightningDatatable {
  static customTypes = {
    badge: {
      template: badgeColumn,
      standardCellLayout: true,
      typeAttributes: ["id", "label"]
    },
    user: {
      template: userColumn,
      standardCellLayout: true,
      typeAttributes: ["id", "name", "photo"]
    },
    fileSize: {
      template: fileSizeColumn,
      standardCellLayout: true,
      typeAttributes: ["size"]
    }
  };
}
