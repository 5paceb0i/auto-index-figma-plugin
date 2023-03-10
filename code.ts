// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  const allTextNodes = figma.currentPage.findAllWithCriteria({
    types: ["TEXT"],
  });
  let matchCounter = 0;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  if (msg.type === "create-rectangles") {
    const indexFrame = figma.createFrame();
    indexFrame.name = "Index Frame";
    indexFrame.layoutMode = "VERTICAL";
    indexFrame.counterAxisSizingMode = "AUTO";
    indexFrame.paddingLeft = 24;
    indexFrame.paddingBottom = 24;
    indexFrame.paddingRight = 24;
    indexFrame.paddingTop = 24;

    let selectionObj = figma.currentPage.selection;
    const textObj = selectionObj[0] as TextNode;
    const anchorTextStyle = textObj.getStyledTextSegments(["fontSize"]);
    console.log(anchorTextStyle);
    for (const textNode of allTextNodes) {
      const textNodeStyle = textNode.getStyledTextSegments(["fontSize"]);
      if (textNodeStyle.length == anchorTextStyle.length) {
        let parentFrame = textNode.parent;
        let styleMatch = 0;
        for (let i = 0; i < textNodeStyle.length; i++) {
          if (textNodeStyle[i].fontSize == anchorTextStyle[i].fontSize) {
            styleMatch++;
          }
        }
        if (styleMatch === textNodeStyle.length && parentFrame) {
          let pageNumText = parentFrame.findChild(
            (n) => n.name === "PageNumberText"
          ) as TextNode;
          let indexText = figma.createText();
          let textNodeVal = textNodeStyle[textNodeStyle.length - 1].characters;
          let pageNumTextVal = pageNumText.characters
            ? pageNumText.characters
            : "x";
          let combineText = textNodeVal + " ...... " + pageNumTextVal;
          // Create FRAME
          var frame_text = figma.createFrame();
          figma.currentPage.appendChild(frame_text);
          frame_text.resize(500.0, 56.0);
          frame_text.counterAxisSizingMode = "AUTO";
          frame_text.counterAxisAlignItems = "MAX";
          frame_text.primaryAxisSizingMode = "FIXED";
          frame_text.expanded = false;
          frame_text.layoutMode = "HORIZONTAL";
          frame_text.counterAxisSizingMode = "AUTO";
          frame_text.itemSpacing = 16;

          var text_1_3 = figma.createText();
          frame_text.appendChild(text_1_3);
          text_1_3.resize(290.0, 14.0);
          text_1_3.textAutoResize = "WIDTH_AND_HEIGHT";
          text_1_3.characters = textNodeVal.slice(2);

          var text_1_4 = figma.createText();
          frame_text.appendChild(text_1_4);
          text_1_4.resize(290.0, 14.0);
          text_1_4.characters =
            "............................................................................................................................................................";
          text_1_4.layoutGrow = 1;
          text_1_4.textAutoResize = "NONE";

          var text_1_5 = figma.createText();
          frame_text.appendChild(text_1_5);
          text_1_5.resize(54.0, 14.0);

          text_1_5.characters = pageNumTextVal;
          text_1_5.fontSize = 12;
          text_1_5.textAutoResize = "WIDTH_AND_HEIGHT";

          //indexText.characters = combineText;
          indexFrame.appendChild(frame_text);
          matchCounter++;
        }
      }
    }

    var selectionFrame = figma.currentPage.findAll(
      (n) => n.name === "Index Frame"
    );
    figma.currentPage.selection = [];
    figma.currentPage.selection = selectionFrame;
    figma.viewport.scrollAndZoomIntoView(selectionFrame);
    console.log("Match Count: ", matchCounter);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
