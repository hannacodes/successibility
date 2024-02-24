import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { fetchAltText, uploadImg } from "./alt-text.js";

addOnUISdk.ready.then(() => {
    console.log("addOnUISdk is ready for use.");
    const clickMeButton = document.getElementById("clickMe");
    clickMeButton.addEventListener("click", async () => {
        clickMeButton.innerHTML = "Clicked";
        const selectedFile = document.getElementById("myFile").files[0];
        const url = await uploadImg(selectedFile);
        let data = await fetchAltText(url);
        let text = data.captionResult
        console.log(text);
        displayText(text.text);
    });

    // Enable the button only when:
    // 1. `addOnUISdk` is ready, and
    // 2. `click` event listener is registered.
    clickMeButton.disabled = false;
});

function displayText(text){
    const txt = document.getElementById("alt-text").innerText = text;
}

