import { LightningElement, api } from "lwc";

export default class FileGrid extends LightningElement {
  @api columns;
  data;
  sortedBy;
  sortDirection = "ASC";

  @api
  set fileData(value) {
    if (!value) {
      this.data = [];
    }

    if (!this.sortedBy) {
      this.data = [...value];
      return;
    }

    this.data = [...value].sort(
      this.sortBy(this.sortedBy, this.sortDirection === "asc" ? 1 : -1)
    );
  }
  get fileData() {
    return this.data;
  }

  get hasData() {
    return this.data && this.data.length > 0;
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    const evt = new CustomEvent("rowaction", { detail: { actionName, row } });
    this.dispatchEvent(evt);
  }

  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    return function (a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.data];

    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.data = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }
}
