import { createElement } from "lwc";
import FileUploadTile from "c/fileUploadTile";

describe("c-file-upload-tile", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Renders nothing if no file is provided", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    document.body.appendChild(element);

    const div = element.shadowRoot.querySelector("div");
    expect(div).toBeNull();
  });

  it("Displays a check mark for uploaded files", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.file = {
      Id: 1,
      Title: "Test.pdf",
      ContentDocumentId: "12345",
      Type__c: "Category A",
      recordId: null,
      ContentSize: 3500
    };
    document.body.appendChild(element);

    const succcessIcon = element.shadowRoot.querySelector("[title=success]");
    expect(succcessIcon).not.toBeNull();
  });

  it("Displays the file name as a link to the preview method", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.file = {
      Id: 1,
      Title: "Test.pdf",
      ContentDocumentId: "12345",
      Type__c: "Category A",
      recordId: null,
      ContentSize: 3500
    };
    document.body.appendChild(element);

    const filename = element.shadowRoot.querySelector("[title=filename]");
    expect(filename.textContent).toBe("Test.pdf");
  });

  it("Displays the file size", () => {
    const element = createElement("c-file-upload-tile", {
      is: FileUploadTile
    });
    element.file = {
      Id: 1,
      Title: "Test.pdf",
      ContentDocumentId: "12345",
      Type__c: "Category A",
      recordId: null,
      ContentSize: 3500
    };
    document.body.appendChild(element);

    const fileSize = element.shadowRoot.querySelector("span");
    expect(fileSize.textContent).toBe("3500 bytes");
  });
});
