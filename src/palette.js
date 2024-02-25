import { getJSON } from "./alt-text.js";

const buildPalette = (colorsList) => {
    const paletteContainer = document.getElementById("palette");
    const protonopiaContainer = document.getElementById("protonopia")
    const deuteranopiaContainer = document.getElementById("deuteranopia")
    const tritanopiaContainer = document.getElementById("tritanopia")
    //const complementaryContainer = document.getElementById("complementary");
    // reset the HTML in case you load various images
    paletteContainer.innerHTML = "";
    protonopiaContainer.innerHTML = "";
    deuteranopiaContainer.innerHTML = "";
    tritanopiaContainer.innerHTML = "";
    //complementaryContainer.innerHTML = "";

    const orderedByColor = orderByLuminance(colorsList);
    const hslColors = convertRGBtoHSL(orderedByColor);

    for (let i = 0; i < orderedByColor.length; i++) {
        const hexColor = rgbToHex(orderedByColor[i]);

        // now we do the color blind stuff

        //const hexColorComplementary = hslToHex(hslColors[i]);

        if (i > 0) {
            const difference = calculateColorDifference(
                orderedByColor[i],
                orderedByColor[i - 1]
            );

            // if the distance is less than 120 we ommit that color
            if (difference < 120) {
                continue;
            }
        }

        var modP = [.7465, .2535, 1.273463, -0.073894],
            modD = [1.4, -.04, .968437, .003331],
            modT = [1.748, 0, .062921, .292119];

        var protonopia = "#" + convert(hexColor, modP);
        var deuteranopia = "#" + convert(hexColor, modD);
        var tritanopia = "#" + convert(hexColor, modT);

        // create the div and text elements for both colors & append it to the document
        const colorElement = document.createElement("div");
        colorElement.style.backgroundColor = hexColor;
        colorElement.appendChild(document.createTextNode(hexColor));
        paletteContainer.appendChild(colorElement);

        const protonopiaElement = document.createElement("div");
        protonopiaElement.style.backgroundColor = protonopia;
        protonopiaElement.appendChild(document.createTextNode(protonopia));
        protonopiaContainer.appendChild(protonopiaElement);

        const deuteranopiaElement = document.createElement("div");
        deuteranopiaElement.style.backgroundColor = deuteranopia;
        deuteranopiaElement.appendChild(document.createTextNode(deuteranopia));
        deuteranopiaContainer.appendChild(deuteranopiaElement);

        const tritanopiaElement = document.createElement("div");
        tritanopiaElement.style.backgroundColor = tritanopia;
        tritanopiaElement.appendChild(document.createTextNode(tritanopia));
        tritanopiaContainer.appendChild(tritanopiaElement);
        // true when hsl color is not black/white/grey
        //if (hslColors[i].h) {
        //const complementaryElement = document.createElement("div");
        //complementaryElement.style.backgroundColor = `hsl(${hslColors[i].h},${hslColors[i].s}%,${hslColors[i].l}%)`;

        //complementaryElement.appendChild(
        //document.createTextNode(hexColorComplementary)
        //);
        //complementaryContainer.appendChild(complementaryElement);
        //}
    }

};

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };

    return (
        "#" +
        componentToHex(pixel.r) +
        componentToHex(pixel.g) +
        componentToHex(pixel.b)
    ).toUpperCase();
};

/**
 * Convert HSL to Hex
 * this entire formula can be found in stackoverflow, credits to @icl7126 !!!
 * https://stackoverflow.com/a/44134328/17150245
 */
const hslToHex = (hslColor) => {
    const hslColorCopy = { ...hslColor };
    hslColorCopy.l /= 100;
    const a =
        (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
    const f = (n) => {
        const k = (n + hslColorCopy.h / 30) % 12;
        const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

/**
 * Convert RGB values to HSL
 * This formula can be
 * found here https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
 */
const convertRGBtoHSL = (rgbValues) => {
    return rgbValues.map((pixel) => {
        let hue,
            saturation,
            luminance = 0;

        // first change range from 0-255 to 0 - 1
        let redOpposite = pixel.r / 255;
        let greenOpposite = pixel.g / 255;
        let blueOpposite = pixel.b / 255;

        const Cmax = Math.max(redOpposite, greenOpposite, blueOpposite);
        const Cmin = Math.min(redOpposite, greenOpposite, blueOpposite);

        const difference = Cmax - Cmin;

        luminance = (Cmax + Cmin) / 2.0;

        if (luminance <= 0.5) {
            saturation = difference / (Cmax + Cmin);
        } else if (luminance >= 0.5) {
            saturation = difference / (2.0 - Cmax - Cmin);
        }

        /**
         * If Red is max, then Hue = (G-B)/(max-min)
         * If Green is max, then Hue = 2.0 + (B-R)/(max-min)
         * If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
         */
        const maxColorValue = Math.max(pixel.r, pixel.g, pixel.b);

        if (maxColorValue === pixel.r) {
            hue = (greenOpposite - blueOpposite) / difference;
        } else if (maxColorValue === pixel.g) {
            hue = 2.0 + (blueOpposite - redOpposite) / difference;
        } else {
            hue = 4.0 + (greenOpposite - blueOpposite) / difference;
        }

        hue = hue * 60; // find the sector of 60 degrees to which the color belongs

        // it should be always a positive angle
        if (hue < 0) {
            hue = hue + 360;
        }

        // When all three of R, G and B are equal, we get a neutral color: white, grey or black.
        if (difference === 0) {
            return false;
        }

        return {
            h: Math.round(hue) + 180, // plus 180 degrees because that is the complementary color
            s: parseFloat(saturation * 100).toFixed(2),
            l: parseFloat(luminance * 100).toFixed(2),
        };
    });
};

/**
 * Using relative luminance we order the brightness of the colors
 * the fixed values and further explanation about this topic
 * can be found here -> https://en.wikipedia.org/wiki/Luma_(video)
 */
const orderByLuminance = (rgbValues) => {
    const calculateLuminance = (p) => {
        return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    };

    return rgbValues.sort((p1, p2) => {
        return calculateLuminance(p2) - calculateLuminance(p1);
    });
};

const buildRgb = (imageData) => {
    const rgbValues = [];
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        };

        rgbValues.push(rgb);
    }

    return rgbValues;
};

/**
 * Calculate the color distance or difference between 2 colors
 *
 * further explanation of this topic
 * can be found here -> https://en.wikipedia.org/wiki/Euclidean_distance
 * note: this method is not accuarate for better results use Delta-E distance metric.
 */
const calculateColorDifference = (color1, color2) => {
    const rDifference = Math.pow(color2.r - color1.r, 2);
    const gDifference = Math.pow(color2.g - color1.g, 2);
    const bDifference = Math.pow(color2.b - color1.b, 2);

    return rDifference + gDifference + bDifference;
};

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues) => {
    /**
     * Min is initialized to the maximum value posible
     * from there we procced to find the minimum value for that color channel
     *
     * Max is initialized to the minimum value posible
     * from there we procced to fin the maximum value for that color channel
     */
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;

    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;

    rgbValues.forEach((pixel) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);

        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
    });

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    // determine which color has the biggest difference
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
        return "r";
    } else if (biggestRange === gRange) {
        return "g";
    } else {
        return "b";
    }
};

/**
 * Median cut implementation
 * can be found here -> https://en.wikipedia.org/wiki/Median_cut
 */
const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 2;

    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
            (prev, curr) => {
                prev.r += curr.r;
                prev.g += curr.g;
                prev.b += curr.b;

                return prev;
            },
            {
                r: 0,
                g: 0,
                b: 0,
            }
        );

        color.r = Math.round(color.r / rgbValues.length);
        color.g = Math.round(color.g / rgbValues.length);
        color.b = Math.round(color.b / rgbValues.length);

        return [color];
    }

    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => {
        return p1[componentToSortBy] - p2[componentToSortBy];
    });

    const mid = rgbValues.length / 2;
    return [
        ...quantization(rgbValues.slice(0, mid), depth + 1),
        ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
};

function convert(hex, mod) {
    var r = parseInt(hex.substring(1, 3), 16),
        g = parseInt(hex.substring(3, 5), 16),
        b = parseInt(hex.substring(5, 7), 16),
        confuseX = mod[0],
        confuseY = mod[1],
        confuseM = mod[2],
        confuseInt = mod[3],
        amount = 1;

    //convert to XYZ color space
    var powR = Math.pow(r, 2.2),
        powG = Math.pow(g, 2.2),
        powB = Math.pow(b, 2.2),
        X = powR * .412424 + powG * .357579 + powB * .180464,
        Y = powR * .212656 + powG * .715158 + powB * .072185,
        Z = powR * .019332 + powG * .119193 + powB * .950444;

    //convert XYZ to xyY
    var chromaX = X / (X + Y + Z),
        chromaY = Y / (X + Y + Z);

    //generate confusion line
    var slope = (chromaY - confuseY) / (chromaX - confuseX),
        int = chromaY - chromaX * slope;

    //calculate deviation
    var deviationX = (confuseInt - int) / (slope - confuseM),
        deviationY = (slope * deviationX) + int;

    //compute simulated color with confusion
    X = deviationX * Y / deviationY;
    Z = (1 - (deviationX + deviationY)) * Y / deviationY;

    //neutral grey
    var neutralX = .312713 * Y / .329016,
        neutralZ = .358271 * Y / .329016;

    //diff between color and grey
    var diffX = neutralX - X,
        diffZ = neutralZ - Z,
        diffR = diffX * 3.24071 + diffZ * -0.498571,
        diffG = diffX * -0.969258 + diffZ * .0415557,
        diffB = diffX * .0556352 + diffZ * 1.05707;

    //convert back to RBG
    var rgbR = X * 3.24071 + Y * -1.53726 + Z * -0.498571,
        rgbG = X * -0.969258 + Y * 1.87599 + Z * .0415557,
        rgbB = X * .0556352 + Y * -.203996 + Z * 1.05707;

    //compensate towards neutral
    var fitR = ((diffR < 0 ? 0 : 1) - rgbR) / diffR,
        fitG = ((diffG < 0 ? 0 : 1) - rgbG) / diffG,
        fitB = ((diffB < 0 ? 0 : 1) - rgbB) / diffB;

    var adjust = [
        (fitR > 1 || fitR < 0) ? 0 : fitR,
        (fitG > 1 || fitG < 0) ? 0 : fitG,
        (fitB > 1 || fitG < 0) ? 0 : fitB
    ];

    adjust = Math.max.apply(null, adjust);

    //shift proportional to the greatest shift
    rgbR = rgbR + (adjust * diffR);
    rgbG = rgbG + (adjust * diffG);
    rgbB = rgbB + (adjust * diffB);

    //gamma correct
    rgbR = Math.pow(rgbR, 1 / 2.2);
    rgbG = Math.pow(rgbG, 1 / 2.2);
    rgbB = Math.pow(rgbB, 1 / 2.2);

    //back to hex
    r = Math.ceil(rgbR).toString(16);
    g = Math.ceil(rgbG).toString(16);
    b = Math.ceil(rgbB).toString(16);

    if (r.length === 1) r = '0' + r;
    if (g.length === 1) g = '0' + g;
    if (b.length === 1) b = '0' + b;
    return r + b + g;

}

export const main = async (image) => {
    // Whenever file & image is loaded procced to extract the information from the image
    console.log(image);
    let data = await getJSON(image);
    let imgurl = data.url;
    // Set the canvas size to be the same as of the uploaded image
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgurl;
    const canvas = document.getElementById("colorBlindCanvas");
    canvas.width = data.width;
    console.log(canvas.width);
    console.log(canvas.height);
    canvas.height = data.height;
    const ctx = canvas.getContext("2d");
    img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0)
    
    /**
     * getImageData returns an array full of RGBA values
     * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
     * (transparency). For array value consistency reasons,
     * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
     */
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert the image data to RGB values so its much simpler
    const rgbArray = buildRgb(imageData.data);

    /**
     * Color quantization
     * A process that reduces the number of colors used in an image
     * while trying to visually maintin the original image as much as possible
     */
    const quantColors = quantization(rgbArray, 0);

    // Create the HTML structure to show the color palette
    buildPalette(quantColors);
});
};
