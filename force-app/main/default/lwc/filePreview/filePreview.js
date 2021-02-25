import { LightningElement, api, track } from "lwc";

export default class FilePreview extends LightningElement {
  @api contentVersionId;
  @api contentDocumentId;

  // List of all potential img urls
  @track imgUrls = [];

  // Page num used for tracking pages
  pageNum = 0;

  // Idicator when loading should be finished, because of failure
  loadFailed = false;

  connectedCallback() {
    // Try to generate url for the first page and add it to imgUrls list for rendering
    this.generateImgUrl();
  }

  handleImgLoadError(event) {
    // When onerror event is triggered on img element, then mark it and don't generate any new img urls
    this.loadFailed = true;
    console.log("failed!");
    this.imgUrls.pop();
  }

  handleImgLoadSuccess(event) {
    // When onload event is triggered on img element, then increase pageNum and try to render one more img
    this.pageNum++;
    this.generateImgUrl();
  }

  generateImgUrl() {
    // let previewUrl = "/sfc/servlet.shepherd/version/renditionDownload";
    // previewUrl += `?rendition=$SVGZ`;
    // previewUrl += `&versionId=${this.contentVersionId}`;
    // previewUrl += `&contentId=${this.contentDocumentId}`;
    // previewUrl += `&page=${this.pageNum}`;
    let community = "test2";
    let previewUrl = `/${community}/sfc/servlet.shepherd/version/renditionDownload?rendition=SVGZ&versionId=${this.contentVersionId}&operationContext=CHATTER&contentId=${this.contentDocumentId}&page=${this.pageNum}`;

    this.imgUrls.push(previewUrl);
  }
}
