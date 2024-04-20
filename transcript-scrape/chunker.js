/// This function gathers content between headings while ignoring any content within <pre> tags as they are typically code blocks.
const getContentBetweenNodes = (startNode, endNode) => {
  let currentNode = startNode;
  let content = "";

  while (currentNode && currentNode !== endNode) {
    const curOuterHTML = currentNode.outerHTML;
    if (curOuterHTML && !currentNode.outerHTML.includes("<pre")) {
      content += curOuterHTML;
    }

    currentNode = currentNode.nextSibling;
  }

  return content;
};

/// This function takes a string of HTML and splits it into blocks based on headings.
/// It ignores any blocks that contain less than 5 words as they are typically not useful.
export const splitHTMLByHeadings = (window, htmlString) => {
  const document = window.document;

  document.body.innerHTML = htmlString;

  const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  const htmlBlocks = [];

  for (let i = 0; i < headingElements.length; i++) {
    const headingElement = headingElements[i];

    const trackingId = headingElement.textContent
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");

    let startNode = headingElement;
    let endNode = null;
    if (i < headingElements.length - 1) {
      endNode = headingElements[i + 1];
    } else {
      endNode = document.body.lastChild;
    }

    const blockContent = getContentBetweenNodes(startNode, endNode);

    const wordCount = blockContent.split(" ").length;
    if (wordCount < 5) {
      continue;
    }

    htmlBlocks.push({
      tracking_id: trackingId,
      chunk_html: blockContent,
    });
  }

  return htmlBlocks;
};
