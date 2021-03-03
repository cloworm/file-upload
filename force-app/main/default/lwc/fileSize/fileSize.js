import { LightningElement, api } from "lwc";

export default class FileSize extends LightningElement {
  _size;

  @api
  set size(value) {
    this._size = this.formatBytes(value);
  }
  get size() {
    return this._size;
  }

  formatBytes(bytes) {
    if (!bytes) return "0 Bytes";

    const i = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
      (bytes / Math.pow(1000, i)).toFixed(2) * 1 +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }
}
