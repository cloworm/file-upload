import { createElement } from "lwc";
import FilePreview from "c/filePreview";

describe("c-file-preview", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('displays message "Salesforce is still preparing your preview, please check back later." if imgUrls is empty', () => {
    const element = createElement("c-file-preview", {
      is: FilePreview
    });
    document.body.appendChild(element);

    const message = element.shadowRoot.querySelector("p");
    expect(message.textContent).toEqual(
      "Salesforce is still preparing your preview, please check back later."
    );
  });
});
