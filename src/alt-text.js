import {AZURE_KEY, IMAGE_KEY} from "./env.js"

export async function fetchAltText(url) {
    //preventDefault();
    console.log(url)
    const res = await fetch('https://successibility.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-10-01', {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    });
    const data = await res.json();
    //console.log(JSON.stringify(data));

    return data
}

export async function uploadImg(img) {
    const form = new FormData();
    //const img2 = JSON.stringify(getBase64(img));
    //console.log(img2)
    form.append('image', img);
    console.log(img);
    //console.log(upload(img));
    try {
        let res = fetch('https://api.imgbb.com/1/upload?expiration=600&key='+IMAGE_KEY, {
            method: 'POST',
            body: form
        });
        const data = await (await res).json()
        console.log(data.data.url)
        return data.data.url
    } catch (error) {
        console.log(error);
    }
}


export async function getJSON(img) {
    const form = new FormData();
    //const img2 = JSON.stringify(getBase64(img));
    //console.log(img2)
    form.append('image', img);
    console.log(img);
    //console.log(upload(img));
    try {
        let res = fetch('https://api.imgbb.com/1/upload?expiration=600&key='+IMAGE_KEY, {
            method: 'POST',
            body: form
        });
        const data = await (await res).json()
        console.log(data.data)
        return data.data
    } catch (error) {
        console.log(error);
    }
}

export async function uploadImgByURL(img) {
    const form = new FormData();
    //const img2 = JSON.stringify(getBase64(img));
    //console.log(img2)
    form.append('image', img);
    console.log("test", img);
    //console.log(upload(img));
        fetch('https://api.imgbb.com/1/upload?expiration=600&key=' + IMAGE_KEY, {
            method: 'POST',
            body: form
        }).then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            console.log(await response.text())
        }).then((data) => {
            console.log(data.data.url)
            return data.data.url
        })
   
}

