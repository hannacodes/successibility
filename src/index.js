import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

await AddOnSdk.ready;

//let test = document.getElementById("anchor").href;

// const sdk = AddOnSdk.app;
// let hi = sdk.document.addImage()

AddOnSdk.ready.then(() => {
  grabImage();
  console.log("addOnUISdk is ready for use.");

  const clickMeButton = document.getElementById("clickMe");
  clickMeButton.addEventListener("click", () => {
    clickMeButton.innerHTML = "Clicked";
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
