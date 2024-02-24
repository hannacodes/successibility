import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

await AddOnSdk.ready;

AddOnSdk.ready.then(() => {
  grabImage();
  
  console.log("addOnUISdk is ready for use.");

  const clickMeButton = document.getElementById("clickMe");
  clickMeButton.addEventListener("click", () => {
    grabImage();
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
});
