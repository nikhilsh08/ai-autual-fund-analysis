import { parse } from "node-html-parser";

type TiptapListItem = {
  key: string;
  value: string[] | null;
};

type TiptapListToJsonResult = string[] | TiptapListItem[];

/**
 * Server-side version of convertTiptapListToJson using node-html-parser
 * Converts specific Tiptap HTML lists into a structured JSON object.
 * @param htmlString - The raw HTML from Tiptap.
 * @param targetClass - The class name to search for (e.g., 'tip-tap-faq').
 * @returns An array of structured objects.
 */
export const convertTiptapListToJsonServer = (
  htmlString: string,
  targetClass: string
): TiptapListToJsonResult => {
  if (!htmlString) return [];

  const root = parse(htmlString);
  const targetList = root.querySelector(`ul.${targetClass}`) || root.querySelector(`ol.${targetClass}`);

  if (!targetList) return [];

  const listItems = targetList.querySelectorAll(":scope > li");

  if (listItems.length === 0) return [];

  // Check if any list item has nested lists
  const hasNestedList = listItems.some((listItem) =>
    listItem.querySelector("ul") || listItem.querySelector("ol")
  );

  if (!hasNestedList) {
    return listItems.map((listItem) => {
      const paragraph = listItem.querySelector("p");
      return paragraph?.textContent?.trim() || "";
    });
  }

  return listItems.map((listItem) => {
    const paragraph = listItem.querySelector("p");
    const primaryText = paragraph?.textContent?.trim() || "";
    const nestedList = listItem.querySelector("ul") || listItem.querySelector("ol");

    if (nestedList) {
      const subItems = nestedList.querySelectorAll("li p").map((p) =>
        p.textContent?.trim() || ""
      );

      return {
        key: primaryText,
        value: subItems,
      };
    }

    return {
      key: primaryText,
      value: null,
    };
  });
};
