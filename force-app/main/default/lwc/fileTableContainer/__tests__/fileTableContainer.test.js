import { createElement } from "lwc";
import FileTableContainer from "c/fileTableContainer";
import getFiles from "@salesforce/apex/FileTableController.getFiles";
const mockGetFiles = require("./data/getFiles.json");
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
const getFilesWireAdapter = registerLdsTestWireAdapter(getFiles);

describe("c-file-table-container", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Displays the file count in a header tag when there are no files", () => {
    const element = createElement("c-file-table-container", {
      is: FileTableContainer
    });
    element.recordId = "12345";
    document.body.appendChild(element);

    const message = element.shadowRoot.querySelector("h2");
    expect(message.textContent).toContain("All Files (0)");
  });

  it("Displays a file count of 2 if getFiles returns 2 files", () => {
    const element = createElement("c-file-table-container", {
      is: FileTableContainer
    });
    element.recordId = "12345";
    document.body.appendChild(element);

    getFilesWireAdapter.emit(mockGetFiles);

    return Promise.resolve().then(() => {
      const message = element.shadowRoot.querySelector("h2");
      expect(message.textContent).toContain("All Files (2)");
    });
  });

  it("Will create 2 accordion sections if getFiles returns 2 unique Type__c values", () => {
    const element = createElement("c-file-table-container", {
      is: FileTableContainer
    });
    element.recordId = "12345";
    document.body.appendChild(element);

    getFilesWireAdapter.emit(mockGetFiles);

    return Promise.resolve().then(() => {
      const input = element.shadowRoot.querySelector("lightning-input");
      input.dispatchEvent(
        new CustomEvent("change", { target: { value: "Test" } })
      );

      const sections = element.shadowRoot.querySelectorAll(
        "lightning-accordion-section"
      );
      expect(sections.length).toEqual(2);
    });
  });
});
