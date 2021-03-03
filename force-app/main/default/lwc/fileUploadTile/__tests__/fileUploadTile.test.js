import { createElement } from "lwc";
import FileUploadTile from "c/fileUploadTile";

describe("c-file-upload-tile", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Renders nothing if no filename is provided", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    document.body.appendChild(element);

    const div = element.shadowRoot.querySelector("div");
    expect(div).toBeNull();
  });

  it("Renders if a filename is provided", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.filename = "Test.pdf";
    document.body.appendChild(element);

    const div = element.shadowRoot.querySelector("div");
    expect(div).not.toBeNull();
  });

  it("Displays a check mark for uploaded files", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.contentVersionId = "28492";
    element.filename = "Test.pdf";
    element.contentDocumentId = "12345";
    element.tag = "Category A";
    element.size = 3500;
    document.body.appendChild(element);

    const succcessIcon = element.shadowRoot.querySelector("[title=success]");
    expect(succcessIcon).not.toBeNull();
  });

  it("Displays the file name as a link to the preview method", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.contentVersionId = "28492";
    element.filename = "Test.pdf";
    element.contentDocumentId = "12345";
    element.tag = "Category A";
    element.size = 3500;
    document.body.appendChild(element);

    const filename = element.shadowRoot.querySelector("[title=filename]");
    expect(filename.textContent).toBe("Test.pdf");
  });

  it("Displays the file size formatted for humans", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.contentVersionId = "28492";
    element.filename = "Test.pdf";
    element.contentDocumentId = "12345";
    element.tag = "Category A";
    element.size = 3500;
    document.body.appendChild(element);

    const fileSize = element.shadowRoot.querySelector("span");
    expect(fileSize.textContent).toBe("3.5 kB");
  });
});
