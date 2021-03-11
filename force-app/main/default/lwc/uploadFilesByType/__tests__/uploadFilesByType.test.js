import { createElement } from "lwc";
import UploadFilesByType from "c/uploadFilesByType";
// import { registerListener, unregisterAllListeners } from 'c/pubsub'

//mock the pubSub methods
jest.mock("c/pubsub", () => {
  return {
    registerListener: jest.fn(),
    unregisterAllListeners: jest.fn(),
    fireEvent: jest.fn(),
    onNewListeners: jest.fn()
  };
});

describe("c-upload-files-by-type", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // Displays c-file-table-container if table is true
  it("Displays c-file-table-container if @api table is true", () => {
    const element = createElement("c-upload-files-by-type", {
      is: UploadFilesByType
    });
    element.table = true;
    document.body.appendChild(element);

    const table = element.shadowRoot.querySelector("c-file-table-container");
    expect(table).not.toBeNull();
  });

  // Does not display c-file-table-container if table is false
  it("Does not display c-file-table-container if @api table is false", () => {
    const element = createElement("c-upload-files-by-type", {
      is: UploadFilesByType
    });
    element.table = false;
    document.body.appendChild(element);

    const table = element.shadowRoot.querySelector("c-file-table-container");
    expect(table).toBeNull();
  });
});
