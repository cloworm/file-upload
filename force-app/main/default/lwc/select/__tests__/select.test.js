import { createElement } from "lwc";
import Select from "c/select";

describe("c-select", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Displays a list of 1 if @api options is not set", () => {
    const element = createElement("c-select", {
      is: Select
    });
    document.body.appendChild(element);

    const options = element.shadowRoot.querySelectorAll("option");
    expect(options.length).toEqual(1);
  });

  it("Displays a list of 4 options if @api options has 3 values", () => {
    const element = createElement("c-select", {
      is: Select
    });
    element.options = [
      {
        value: "Option 1",
        label: "Option 1"
      },
      {
        value: "Option 2",
        label: "Option 2"
      },
      {
        value: "Option 3",
        label: "Option 3"
      }
    ];
    document.body.appendChild(element);

    const options = element.shadowRoot.querySelectorAll("option");
    expect(options.length).toEqual(4);
  });

  it("Dispatches an onchange event when an option is selected", () => {
    const element = createElement("c-select", {
      is: Select
    });
    element.options = [
      {
        value: "Option 1",
        label: "Option 1"
      },
      {
        value: "Option 2",
        label: "Option 2"
      },
      {
        value: "Option 3",
        label: "Option 3"
      }
    ];
    document.body.appendChild(element);

    const handler = jest.fn();
    element.addEventListener("change", handler);

    const select = element.shadowRoot.querySelector("select");
    select.dataset.id = "1";
    select.value = "Option 1";
    select.dispatchEvent(new CustomEvent("change"));

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail.value).toEqual("Option 1");
  });
});
