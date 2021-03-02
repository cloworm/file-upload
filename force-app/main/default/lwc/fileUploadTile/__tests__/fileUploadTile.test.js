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
      id: 1,
      filename: "Test.pdf",
      ContentDocumentId: "12345",
      type: "application/pdf",
      base64: "",
      recordId: null,
      size: 3500,
      error: null
    };
    document.body.appendChild(element);

    const succcessIcon = element.shadowRoot.querySelector("[title=success]");
    expect(succcessIcon).not.toBeNull();
  });
});
