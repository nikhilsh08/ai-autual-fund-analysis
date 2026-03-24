import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type TiptapListItem = {
  key: string;
  value: string[] | null;
};

type TiptapListToJsonResult = string[] | TiptapListItem[];

/**
 * Converts specific Tiptap HTML lists into a structured JSON object.
 * @param htmlString - The raw HTML from Tiptap.
 * @param targetClass - The class name to search for (e.g., 'tip-tap-faq').
 * @returns An array of structured objects.
 */
export const convertTiptapListToJson = (
  htmlString: string,
  targetClass: string
): TiptapListToJsonResult => {
  if (!htmlString) return [];
  if (typeof DOMParser === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const targetList = doc.querySelector(`ul.${targetClass}, ol.${targetClass}`);

  if (!targetList) return [];

  const listItems = Array.from(targetList.children).filter(
    (element) => element.tagName === 'LI'
  );

  const hasNestedList = listItems.some((listItem) => listItem.querySelector('ul, ol'));

  if (!hasNestedList) {
    return listItems.map(
      (listItem) => listItem.querySelector('p')?.textContent?.trim() || ''
    );
  }

  return listItems.map((listItem) => {
    const primaryText = listItem.querySelector('p')?.textContent?.trim() || '';
    const nestedList = listItem.querySelector('ul, ol');

    if (nestedList) {
      const subItems = Array.from(nestedList.querySelectorAll('li p')).map((paragraph) =>
        paragraph.textContent?.trim() || ''
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
