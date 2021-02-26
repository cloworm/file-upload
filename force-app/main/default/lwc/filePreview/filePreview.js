import { LightningElement, api, track } from "lwc";
import getSiteUrl from "@salesforce/apex/GetSite.getSiteUrl";

export default class FilePreview extends LightningElement {
  @api contentVersionId;
  @api contentDocumentId;
  @api type;

  get isImage() {
    if (!this.type) return false;

    return ["BMP", "GIF", "JPG", "JPEG", "PNG"].includes(
      this.type.toUpperCase()
    );
  }

  // List of all potential img urls
  @track
  imgUrls = [];

  // Page num used for tracking pages
  pageNum = 0;

  // Idicator when loading should be finished, because of failure
  loadFailed = false;

  connectedCallback() {
    // Try to generate url for the first page and add it to imgUrls list for rendering
    this.generateImgUrl();
  }

  handleImgLoadError() {
    // When onerror event is triggered on img element, then mark it and don't generate any new img urls
    this.loadFailed = true;
    // {"message":"Creating renditions of the file."}
    this.imgUrls.pop();
  }

  handleImgLoadSuccess() {
    // When onload event is triggered on img element, then increase pageNum and try to render one more img
    this.pageNum++;

    if (!this.isImage) {
      this.generateImgUrl();
    }
  }

  generateImgUrl() {
    getSiteUrl().then((url) => {
      let siteUrl;

      if (url) {
        siteUrl = url.replace(/\/s$/g, "");
      }

      const previewUrl = `${siteUrl}/sfc/servlet.shepherd/version/renditionDownload?rendition=${
        this.isImage ? this.getRendition() : "SVGZ"
      }&versionId=${this.contentVersionId}&operationContext=CHATTER&contentId=${
        this.contentDocumentId
      }${this.isImage ? "" : `&page=${this.pageNum}`}`;

      this.imgUrls.push(previewUrl);
    });
  }

  get hasPreview() {
    return this.imgUrls && this.imgUrls.length > 0;
  }

  getRendition() {
    switch (this.type.toUpperCase()) {
      case "PNG":
        return "ORIGINAL_Png";

      case "JPEG":
        return "ORIGINAL_Jpeg";

      case "GIF":
        return "ORIGINAL_Gif";

      case "BMP":
        return "ORIGINAL_Bmp";

      case "JPG":
        return "ORIGINAL_Jpg";

      default:
        return "THUMB720BY480";
    }
  }
}
