import { createElement } from "lwc";
import FileUpload from "c/fileUpload";
import getVersionInfo from "@salesforce/apex/FileUploadController.getVersionInfo";

jest.mock(
  "@salesforce/apex/FileUploadController.getVersionInfo",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

const GET_VERSION_INFO_SUCCESS = [
  {
    Id: "12345",
    Title: "Test.png",
    ContentSize: "5000",
    FileType: "PNG",
    ContentDocumentId: "45683"
  }
];

describe("c-file-upload", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  it("Fires an onuploaded event when lightning-file-upload finishes uploading", async () => {
    // Assign mock value for resolved Apex promise
    getVersionInfo.mockResolvedValue(GET_VERSION_INFO_SUCCESS);

    const element = createElement("c-file-upload", {
      is: FileUpload
    });
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("uploaded", handler);

    return Promise.resolve()
      .then(() => {
        const lightningFileUpload = element.shadowRoot.querySelector(
          "lightning-file-upload"
        );
        lightningFileUpload.dispatchEvent(
          new CustomEvent("uploadfinished", {
            detail: { files: GET_VERSION_INFO_SUCCESS }
          })
        );

        return Promise.resolve();
      })
      .then(() => {
        expect(handler).toHaveBeenCalled();
      });
  });
});
