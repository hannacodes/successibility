import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

await AddOnSdk.ready;

//let test = document.getElementById("anchor").href;

// 
// let hi = sdk.document.addImage()

AddOnSdk.ready.then(() => {
  grabImage();
  
  console.log("addOnUISdk is ready for use.");

  const clickMeButton = document.getElementById("clickMe");
  clickMeButton.addEventListener("click", () => {
    grabImage();
    logMetadata();
  });

  clickMeButton.disabled = false;

  async function grabImage() {
    try {
      const renditionOptions = {
        range: AddOnSdk.constants.Range.entireDocument,
        format: AddOnSdk.constants.RenditionFormat.png,
        backgroundColor: 0x7FAA77FF
      };
      const renditions = await AddOnSdk.app.document.createRenditions(
        renditionOptions,
        AddOnSdk.constants.RenditionIntent.preview
      );
      renditions.forEach(rendition => {
        const image = document.querySelector("#canvas");
        image.src = URL.createObjectURL(rendition.blob);
        document.body.appendChild(image);
      });
    } catch (error) {
      console.log("ERROR" + error);
    }
  }

  //grab data
  async function logMetadata() {
    try {
      const pages = (await AddOnSdk.app.document.getPagesMetadata({
                              range: AddOnSdk.constants.Range.specificPages,
                              pageIds: [
                                  "7477a5e7-02b2-4b8d-9bf9-f09ef6f8b9fc",
                                  "d45ba3fc-a3df-4a87-80a5-655e5f8f0f96"
                              ]
                          }));
      for (const page of pages) {
        console.log("Page id: ", page.id);
        console.log("Page title: ", page.title);
        console.log("Page size: ", page.size);
        console.log("Page has premium content: ", page.hasPremiumContent);
        console.log("Page has timelines: ", page.hasTemporalContent);
        console.log("Pixels per inch: ", page.pixelsPerInch);
      }
    }
    catch(error) {
      console.log("Failed to get metadata:", error);
    }
  
  }
  // Add image via blob to the current page
  // async function addImageFromBlob(blob) {
  //   try {
  //     await document.addImage(blob);
  //   } catch (error) {
  //     console.log("Failed to add the image to the page.");
  //   }
  // }

  // // Add image via url to the current page
  // async function addImageFromURL(url) {
  //   try {
  //     const blob = await fetch(url).then((response) => response.blob());
  //     await document.addImage(blob);
  //   } catch (error) {
  //     console.log("Failed to add the image to the page.");
  //   }
  // }
});
