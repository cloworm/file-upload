import { createElement } from "lwc";
import FileTable from "c/fileTable";

describe("c-file-table", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('displays message "No data found." when it receives no fileData', () => {
    const element = createElement("c-file-table", {
      is: FileTable
    });
    document.body.appendChild(element);

    const message = element.shadowRoot.querySelector("p");
    expect(message.textContent).toEqual("No data found.");
  });

  it("displays a c-file-datatable component with it receives fileData", () => {
    const element = createElement("c-file-table", {
      is: FileTable
    });
    element.fileData = [
      {
        Id: "28395",
        Title: "Test.pdf",
        ContentDocumentId: "12345",
        Type: "Category A",
        ContentSize: 3500
      },
      {
        Id: "12345",
        Title: "Test2.pdf",
        ContentDocumentId: "12345",
        Type: "Category B",
        ContentSize: 3500
      }
    ];
    document.body.appendChild(element);

    const datatable = element.shadowRoot.querySelector("c-file-datatable");
    expect(datatable).not.toBeUndefined();
  });
});
