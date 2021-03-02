import { createElement } from "lwc";
import FileGrid from "c/fileGrid";

describe("c-file-table", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('displays message "No data found." when it receives no gridData', () => {
    const element = createElement("c-file-table", {
      is: FileGrid
    });
    // element.tableData = [
    //   {
    //     Id: 1,
    //     Title: "Test.pdf",
    //     ContentDocumentId: "12345",
    //     Type__c: "Category A",
    //     recordId: null,
    //     ContentSize: 3500
    //   }
    // ];
    document.body.appendChild(element);

    const message = element.shadowRoot.querySelector("p");
    expect(message.textContent).toEqual("No data found.");
  });
});
