import { createElement } from "lwc";
import FileGrid from "c/fileGridContainer";

describe("c-file-grid-container", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('Displays the message "This record has no files yet" if the record has none', () => {
    const element = createElement("c-file-grid-container", {
      is: FileGrid
    });
    document.body.appendChild(element);

    const message = element.shadowRoot.querySelector("p");
    expect(message.textContent).toContain("This record has no files yet");
  });
});
