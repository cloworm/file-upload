import LightningDatatable from "lightning/datatable";
import badgeColumn from "./badgeColumn.html";
import userColumn from "./userColumn.html";
import fileSizeColumn from "./fileSizeColumn.html";
import previewColumn from "./previewColumn.html";
import editColumn from "./editColumn.html";
import downloadColumn from "./downloadColumn.html";
import deleteColumn from "./deleteColumn.html";
import filenameColumn from "./filenameColumn.html";

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
    },
    preview: {
      template: previewColumn,
      standardCellLayout: false,
      typeAttributes: ["id"]
    },
    edit: {
      template: editColumn,
      standardCellLayout: false,
      typeAttributes: ["id"]
    },
    download: {
      template: downloadColumn,
      standardCellLayout: false,
      typeAttributes: ["id"]
    },
    delete: {
      template: deleteColumn,
      standardCellLayout: false,
      typeAttributes: ["id"]
    },
    filename: {
      template: filenameColumn,
      standardCellLayout: false,
      typeAttributes: ["filename"]
    }
  };
}
