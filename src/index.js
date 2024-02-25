import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { fetchAltText, uploadImg } from "./alt-text.js";

AddOnSdk.ready.then(() => {
<<<<<<< HEAD
  grabImage();

  const clickMeButton = document.getElementById("clickMe");
  clickMeButton.addEventListener("click", () => {
=======
    console.log("AddOnSDK is ready for use.");
    const clickMeButton = document.getElementById("clickMe");
    
>>>>>>> origin/main
    grabImage();

    clickMeButton.addEventListener("click", async () => {
        clickMeButton.innerHTML = "Clicked";
        grabImage();
        const selectedFile = document.getElementById("myFile").files[0];
        const url = await uploadImg(selectedFile);
        let data = await fetchAltText(url);
        let text = data.captionResult
        console.log(text);
        displayText(text.text);
    });

  console.log("AddOnSDK is ready for use.");

  clickMeButton.disabled = false;

  async function grabImage() {
    try {
      const renditionOptions = {
        range: AddOnSdk.constants.Range.entireDocument,
        format: AddOnSdk.constants.RenditionFormat.png,
        backgroundColor: 0x7faa77ff,
      };
      const renditions = await AddOnSdk.app.document.createRenditions(
        renditionOptions,
        AddOnSdk.constants.RenditionIntent.preview
      );
      renditions.forEach((rendition) => {
        const image = document.querySelector("#canvas");
        image.src = URL.createObjectURL(rendition.blob);
      });
    } catch (error) {
      console.log("ERROR" + error);
    }
  }

  var firstColor = document.querySelector("#firstColor");
  var secondColor = document.querySelector("#secondColor");
  var colorContrast = document.querySelector("#colorContrast");

  firstColor.addEventListener("input", () => {
    calculateColorContrast();
  });

  secondColor.addEventListener("input", () => {
    calculateColorContrast();
  });

  var hex2rgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  function calculateLuminance(hexColor) {
    var rgbColor = hex2rgb(hexColor);
    var r = rgbColor.r;
    var g = rgbColor.g;
    var b = rgbColor.b;
    var a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
  }
  /* 
    To calculate contrast, calculate luminance in RGB colorspace 
    L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    if RGB <= 0.03928 then RGB/12.92 else ((RsRGB+0.055)/1.055) ^ 2.4
    2.4 = GAMMA

    contrast ratio = (L1 + 0.05) / (L2 + 0.05)
    */
  const RED = 0.2126;
  const GREEN = 0.7152;
  const BLUE = 0.0722;

  const GAMMA = 2.4;
  function calculateColorContrast() {
    var colorA = firstColor.value;
    var colorB = secondColor.value;
    console.log(colorA);
    console.log(colorB);

    var luminanceA = calculateLuminance(colorA);
    var luminanceB = calculateLuminance(colorB);

    var brightest = Math.max(luminanceA, luminanceB);
    var darkest = Math.min(luminanceA, luminanceB);

    var contrast = (brightest + 0.05) / (darkest + 0.05);

    console.log(contrast);

    // min: 0
    // max: 21
    colorContrast.innerHTML = contrast;

    return contrast;
  }
});

function displayText(text){
    const txt = document.getElementById("alt-text").innerText = text;
}

