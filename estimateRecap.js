const sharp = require('sharp');
const axios = require('axios');
const { PNG } = require('pngjs');
const convert = require('color-convert');

const COLOR_THRESHOLD = 6
const MINI_PIXEL = 1500
const shapeWeight = 0.7 // Adjust as needed
const centerDistanceWeight = 0.3; // Adjust as needed

async function manipulateImage(base64String, topOffset, height, width, s3Id) {
    try {
        // Remove the data URI prefix (e.g., 'data:image/png;base64,')
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

        // Convert the base64 string to a Buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
        // Read the input image
        const image = await sharp(imageBuffer)
            .extract({ left: 0, top: topOffset, width: width, height: height })
            .modulate({ saturation: 0 })
            .greyscale()
            .png()
            .toBuffer();
        let base64Result = `data:image/png;base64,${image.toString('base64')}`;

        await axios({
            url: `https://d3tl89yfq0.execute-api.cn-northwest-1.amazonaws.com.cn/default/recaptcha-savePic`,
            method: 'post',
            data: {
                base64: base64Result,
                id: s3Id
            },
            timeout: 90000
        }).then((v) => {
            console.log("uploaded corped image.");
        }).catch((err) => {
            console.log(err.message);
        });

        console.log('Image manipulation complete.');
    } catch (error) {
        console.error('Error manipulating image:', error);
    }
}

async function fastRam(host, s3Id) {
    let input = `https://recaptcha.s3.cn-northwest-1.amazonaws.com.cn/${s3Id}.png`;
    let result = '';
    await axios({
        url: `http://${host}:5000/predictions`,
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            input: {
                input_image: input,
                better_quality : true
            }
        },
        timeout: 90000
    }).then(async (v) => {
        result = v.data.output;
    }).catch((err) => {
        console.log(err.message);
    });

    return result;
}

function calculateHSLDistance(color1, color2) {
    
    const hsl1 = convert.rgb.hsl(color1[0], color1[1], color1[2]);
    const hsl2 = convert.rgb.hsl(color2[0], color2[1], color2[2]);

    // Calculate the absolute differences in HSL values
    
    const hDistance = Math.abs(hsl1[0] - hsl2[0]);
    // const sDistance = Math.abs(hsl1[1] - hsl2[1]);
    // const lDistance = Math.abs(hsl1[2] - hsl2[2]);

    // You can adjust weights or add more criteria based on your requirements
    return hDistance;
}


// Function to get the color of a pixel in the image
function getColorAtPixel(png, x, y) {
    const index = (png.width * y + x) << 2; // Each pixel takes 4 bytes (RGBA)
    return [png.data[index], png.data[index + 1], png.data[index + 2]];
}

// Function to calculate the bounding box of a region
function calculateBoundingBox(coordinates) {
    let top = Number.MAX_SAFE_INTEGER;
    let bottom = 0;
    let left = Number.MAX_SAFE_INTEGER;
    let right = 0;

    coordinates.forEach(({ x, y }) => {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
    });

    return { top, bottom, left, right };
}

// Function to compare the shapes of two regions based on point distribution
function compareShapes(region1, region2) {
    const histogram1 = calculateHistogram(region1);
    const histogram2 = calculateHistogram(region2);
    // Compare histograms, for example, using the Earth Mover's Distance (EMD)
    const earthMoversDistance = calculateEarthMoversDistance(histogram1.histogramX, histogram2.histogramX) +
        calculateEarthMoversDistance(histogram1.histogramY, histogram2.histogramY);
    return earthMoversDistance;
}

// Function to calculate a histogram of point distribution in a region
function calculateHistogram(region) {
    const numBins = 360; // Adjust the number of bins as needed
    //const binWidth = 360 / numBins;

    const boundingBox = calculateBoundingBox(region);

    const histogramX = Array(numBins).fill(0);
    const histogramY = Array(numBins).fill(0);

    for (const point of region) {
        // Normalize the point coordinates based on the bounding box
        const normalizedX = point.x - boundingBox.left;
        const normalizedY = point.y - boundingBox.top;

        // Calculate the bin index for x coordinate
        const binIndexX = Math.floor((normalizedX / (boundingBox.right - boundingBox.left)) * (numBins - 1));
        histogramX[binIndexX]++;

        // Calculate the bin index for y coordinate
        const binIndexY = Math.floor((normalizedY / (boundingBox.bottom - boundingBox.top)) * (numBins - 1));
        histogramY[binIndexY]++;
    }
    return { histogramX, histogramY };
}

// Function to calculate the cumulative distribution of a histogram
function calculateCumulativeDistribution(histogram) {
    return histogram.reduce((cumulative, binValue, index) => {
        const previousCumulative = index > 0 ? cumulative[index - 1] : 0;
        cumulative.push(previousCumulative + binValue);
        return cumulative;
    }, []);
}

// Function to calculate the Earth Mover's Distance between two histograms
function calculateEarthMoversDistance(histogram1, histogram2) {
    // Implement the Earth Mover's Distance calculation algorithm
    // This depends on the specifics of your application and the desired metric
    // A simple example could be the Manhattan distance between cumulative distributions

    const cumulative1 = calculateCumulativeDistribution(histogram1);
    const cumulative2 = calculateCumulativeDistribution(histogram2);

    let emd = cumulative1.reduce((distance, binValue, index) => {

        const difference = Math.abs(binValue - cumulative2[index]);
        return distance + difference;
    }, 0);
    return emd;
}

// Function to find the most similar pair of regions
function findMostSimilarRegions(regions) {
    let mostSimilarRegionIds = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    // Find the max value for normalization
    let maxShapeDistance = Number.MIN_SAFE_INTEGER;
    let maxCenterDistance = Number.MIN_SAFE_INTEGER;
    let maxBoxDistance = Number.MIN_SAFE_INTEGER;

    // Loop through all pairs of regions to find max value
    for (const [, coordinates1] of regions.entries()) {
        for (const [, coordinates2] of regions.entries()) {
            if (coordinates1 === coordinates2) continue; // Skip the same region

            const shapeDifference = compareShapes(coordinates1, coordinates2);
            const center1 = calculateCenterPoint(coordinates1).y;
            const center2 = calculateCenterPoint(coordinates2).y;
            const centerDistance = Math.abs(center1 - center2)

            // Update max value
            maxShapeDistance = Math.max(shapeDifference, maxShapeDistance);
            maxCenterDistance = Math.max(centerDistance, maxCenterDistance);
        }
    }

    // Loop through all pairs of regions
    for (const [regionId1, coordinates1] of regions.entries()) {
        for (const [regionId2, coordinates2] of regions.entries()) {
            if (coordinates1 === coordinates2) continue; // Skip the same region

            const shapeDifference = compareShapes(coordinates1, coordinates2);
            const center1 = calculateCenterPoint(coordinates1).y;
            const center2 = calculateCenterPoint(coordinates2).y;

            // Normalize values
            const normalizedShapeDifference = shapeDifference / maxShapeDistance;
            const normalizedCenterDistance = Math.abs(center1 - center2) / maxCenterDistance;
            // Adjust weights based on your requirements
            
            // Calculate the combined similarity score
            const combinedDistance = (shapeWeight * normalizedShapeDifference) +
                                     (centerDistanceWeight * normalizedCenterDistance)

            if (combinedDistance < minDistance) {
                minDistance = combinedDistance;
                mostSimilarRegionIds = [regionId1, regionId2];
            }
        }
    }

    if (mostSimilarRegionIds !== null) {
        // Calculate the center point of the most similar regions
        const mostSimilarRegion1Coordinates = regions.get(mostSimilarRegionIds[0]);
        const mostSimilarRegion2Coordinates = regions.get(mostSimilarRegionIds[1]);
        const center1 = calculateCenterPoint(mostSimilarRegion1Coordinates);
        const center2 = calculateCenterPoint(mostSimilarRegion2Coordinates);

        return [
            { regionId: mostSimilarRegionIds[0], center: center1 },
            { regionId: mostSimilarRegionIds[1], center: center2 }
        ];
    } else {
        return null;
    }
}




function calculateCenterPoint(coordinates) {
    const centerX = coordinates.reduce((sum, coord) => sum + coord.x, 0) / coordinates.length;
    const centerY = coordinates.reduce((sum, coord) => sum + coord.y, 0) / coordinates.length;

    return { x: centerX, y: centerY };
}

async function generateBinaryImages(regions, width, height, outputDir) {
    // Create binary images for each region
    for (const [regionId, coordinates] of regions.entries()) {
        // Create a new sharp image with black background
        const binaryImage = sharp(Buffer.alloc(width * height * 4).fill(0), {
            raw: {
                width,
                height,
                channels: 4, // RGBA
            },
        });

        let buffer = await binaryImage.raw().toBuffer();
        // Set the pixels in the region to white
        coordinates.forEach(({ x, y }) => {
            const index = (width * y + x) * 4; // Each pixel takes 4 bytes (RGBA)
            buffer[index] = 255; // R channel
            buffer[index + 1] = 255; // G channel
            buffer[index + 2] = 255; // B channel
            buffer[index + 3] = 255; // A channel (alpha, set to fully opaque)
        });

        // Save the binary image to a file
        await sharp(buffer, { raw: { width, height, channels: 4 } })
            .toFile(`${outputDir}/region_${regionId}.jpg`);
    }
}

async function manipulateMask(base64String, width, height) {
    let finalPoint = null;
    // Remove the data URI prefix (e.g., 'data:image/png;base64,')
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Convert the base64 string to a Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    // Parse the PNG buffer
    const png = new PNG();
    const parsedImage = await new Promise((resolve, reject) => {
        png.parse(imageBuffer, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });

    // Track regions using a Map, where the key is the region ID and the value is an array of coordinates
    let regions = new Map();

    // Initialize a 2D array to mark visited pixels
    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    // Function to check if two colors are similar
    function areColorsSimilar(color1, color2, threshold) {
        const distance = calculateHSLDistance(color1, color2);
        return distance < threshold;
    }

    // Function to perform region growing from a seed point
    function growRegion(seedPoint, regionId) {
        const queue = [seedPoint];
        const currentRegion = [];
        let colorPoint = seedPoint
        while (queue.length > 0) {
            const currentPixel = queue.pop();
            const { x, y } = currentPixel;

            if (visited[y][x]) continue;

            const currentColor = getColorAtPixel(png, x, y);
            const threshold = COLOR_THRESHOLD; // Adjust the threshold as needed
            if (areColorsSimilar(currentColor, getColorAtPixel(png, colorPoint.x, colorPoint.y), threshold)) {
                visited[y][x] = true;
                currentRegion.push(currentPixel);
                colorPoint = { x: currentPixel.x, y: currentPixel.y };

                // Add neighbors to the queue
                if (x > 0) queue.push({ x: x - 1, y });
                if (x < width - 1) queue.push({ x: x + 1, y });
                if (y > 0) queue.push({ x, y: y - 1 });
                if (y < height - 1) queue.push({ x, y: y + 1 });
            }
        }

        // Add the current region to the regions map
        regions.set(regionId, currentRegion);
    }

    // Initialize a region ID counter
    let regionIdCounter = 0;

    // Loop through each pixel to start region growing
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!visited[y][x]) {
                growRegion({ x, y }, regionIdCounter++);
            }
        }
    }

    regions = new Map([...regions.entries()].filter(([regionId, coordinates]) => coordinates.length >= MINI_PIXEL));
    regions = new Map([...regions.entries()].filter(([regionId, coordinates]) => calculateCenterPoint(coordinates).x > 25 && calculateCenterPoint(coordinates).x < (width - 25)));
    // Number of regions
    const numberOfRegions = regions.size;

    // Log information about regions
    console.log(`Number of regions: ${numberOfRegions}`);
    const regionEntries = Array.from(regions.entries());

    for (let i = 0; i < regionEntries.length; await i++) {
        const [regionId, coordinates] = regionEntries[i];
        console.log(`Region ${regionId}: ${coordinates.length} pixels`);
        //await generateBinaryImages(regions, width, height, `./mask`);
    }

    // Find the most similar region to the target region
    const mostSimilarRegions = await findMostSimilarRegions(regions);
    if (mostSimilarRegions !== null) {
        console.log(`most similar regions: `);
        console.log(`${JSON.stringify(mostSimilarRegions[0])}`)
        console.log(`${JSON.stringify(mostSimilarRegions[1])}`)
        finalPoint = [mostSimilarRegions[0].center, mostSimilarRegions[1].center];
    } else {
        console.log('No similar region found.');
    }

    return finalPoint;
}

// Example usage
const inputImageString = ``
//manipulateImage(inputImageString, 167, 55, 480);
//fastRam("47.116.48.1", "https://recaptcha.s3.cn-northwest-1.amazonaws.com.cn/fast_sam_test.png")
//manipulateMask(inputImageString, 480, 65)
let estimateRecap = async (opt) => {
    const { imgString, topOffset, height, width, s3Id, samHost } = opt;
    //await manipulateImage(imgString, topOffset, height, width, s3Id);
    let result = await fastRam(samHost, s3Id);

    // const base64Data = result.replace(/^data:image\/\w+;base64,/, '');

    // // Convert the base64 string to a Buffer
    // const imageBuffer = Buffer.from(base64Data, 'base64');
    // // Read the input image
    // const image = await sharp(imageBuffer)
    //     .png()
    //     .toFile("./mask/sam.png");

    return await manipulateMask(result, width, height);
};

// estimateRecap({
//     imgString: inputImageString,
//     topOffset: 30,
//     height: 150,
//     width: 960,
//     s3Id: "test5-s3ID",
//     samHost: "47.100.114.158"
// })

module.exports = {
    estimateRecap
};
