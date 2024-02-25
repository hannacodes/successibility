import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { fetchAltText, uploadImg } from "./alt-text.js";
import { main } from "./palette.js"

AddOnSdk.ready.then(() => {
    console.log("AddOnSDK is ready for use.");
    const refreshButton = document.getElementById("refresh");
    const altTextButton = document.getElementById("altTxtBtn");
    const colorBlindButton = document.getElementById("btnLoad"); 

  grabImage();
  refreshButton.addEventListener("click", async () => {
    grabImage();
  });

    altTextButton.addEventListener("click", async () => {
        await generateAltText();
    });
    
    colorBlindButton.addEventListener("click", async () => {
        let renditions = await getRenditions();
        main(renditions[0].blob);

        let originalColors = document.getElementById("originalColors"); 
        let protonopiaColors = document.getElementById("protonopiaColors"); 
        let deuteranopiaColors = document.getElementById("deuteranopiaColors"); 
        let tritanopiaColors = document.getElementById("tritanopiaColors"); 

        originalColors.innerHTML = "Original Colors";
        protonopiaColors.innerHTML = "Protonopia (Red Deficient)"; 
        deuteranopiaColors.innerHTML = "Deuteranopia (Green Deficient)"; 
        tritanopiaColors.innerHTML = "Tritanopia (Blue Deficient)"; 
    });

  console.log("AddOnSDK is ready for use.");

  refreshButton.disabled = false;
  altTextButton.disabled = false;

  async function grabImage() {
    try {
      let renditions = await getRenditions();
      renditions.forEach((rendition) => {
        const image = document.querySelector("#canvas");
        image.src = URL.createObjectURL(rendition.blob);
        // document.body.appendChild(image);
      });
    } catch (error) {
      console.log("ERROR" + error);
    }
  }

    async function generateAltText() {
        displayText("loading...")
        let renditions = await getRenditions();
        const dataurl = (await uploadImg(renditions[0].blob))
        //console.log(document.getElementById("canvas").src);
        let data = await fetchAltText(dataurl);
        let text = data.captionResult
        console.log(text);
        displayText(text.text);
    }

  async function getRenditions() {
    const renditionOptions = {
      range: AddOnSdk.constants.Range.entireDocument,
      format: AddOnSdk.constants.RenditionFormat.png,
      backgroundColor: 0x7faa77ff,
    };
    const renditions = await AddOnSdk.app.document.createRenditions(
      renditionOptions,
      AddOnSdk.constants.RenditionIntent.preview
    );
    return renditions;
  }

  var firstColor = document.querySelector("#firstColor");
  var secondColor = document.querySelector("#secondColor");
  var colorContrast = document.querySelector("#colorContrast");

  firstColor.addEventListener("input", () => {
    calculateColorContrast();
    progressBar();
  });

  secondColor.addEventListener("input", () => {
    calculateColorContrast();
    progressBar();
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
  let numContrast = 0;

  function calculateColorContrast() {
    var colorA = firstColor.value;
    var colorB = secondColor.value;
    // console.log(colorA);
    // console.log(colorB);

    var luminanceA = calculateLuminance(colorA);
    var luminanceB = calculateLuminance(colorB);

    var brightest = Math.max(luminanceA, luminanceB);
    var darkest = Math.min(luminanceA, luminanceB);

    var contrast = (brightest + 0.05) / (darkest + 0.05);

    console.log(contrast);

    // min: 0
    // max: 21
    //colorContrast.innerHTML = contrast;

    numContrast = contrast;
    return contrast;
  }

  function progressBar() {
    let arrow = document.getElementById("arrow");
    if (numContrast <= 1.5) {
      arrow.style.padding = "0px 0vw";
    } else if (numContrast <= 1) {
      arrow.style.padding = "0px 10.62vw";
    } else if (numContrast <= 2) {
      arrow.style.padding = "0px 21.25vw";
    } else if (numContrast <= 3) {
      arrow.style.padding = "0px 31.9vw";
    } else if (numContrast <= 9.3) {
      arrow.style.padding = "0px 42.5vw";
    } else if (numContrast <= 12.5) {
      arrow.style.padding = "0px 53.1vw";
    } else if (numContrast <= 15.8) {
      arrow.style.padding = "0px 63.8vw";
    } else if (numContrast <= 18.5) {
      arrow.style.padding = "0px 74.4vw";
    } else {
      arrow.style.padding = "0px 93%";
    }
  }
});

function displayText(text) {
    const txt = document.getElementById("alt-text").value = text;
}
