import LightningDatatable from "lightning/datatable";
import badgeColumn from "./badgeColumn.html";

export default class FileDataTable extends LightningDatatable {
  static customTypes = {
    badge: {
      template: badgeColumn,
      standardCellLayout: true
    }
  };
}
