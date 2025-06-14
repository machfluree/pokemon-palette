# Color Worker

A Web Worker that extracts a color palette from image data using k-means clustering.

## Overview

This worker processes raw image pixel data to identify the dominant colors in an image. It filters out transparent pixels, clusters the remaining colors using the k-means algorithm, and returns a palette of hex color codes representing the main colors.

## Features

- Filters out pixels with low opacity (alpha < 128)  
- Uses k-means clustering to find dominant colors  
- Returns color palette as an array of hex strings (e.g., `#FF5733`)  
- Runs in a Web Worker for non-blocking performance  

## Usage

### Posting a message to the worker

Send a message containing:

- `imageData`: An `ImageData` object (e.g., from a canvas context)  
- `colorCount`: Number of dominant colors to extract  

```js
worker.postMessage({ imageData, colorCount });
```

### Receiving the palette

Listen for the worker's response:

```js
worker.onmessage = (e) => {
  const palette = e.data; // Array of hex color strings
  console.log('Extracted palette:', palette);
};
```

## Implementation Details

### Main Functions

- **`self.onmessage`**  
  Extracts opaque pixels, runs k-means clustering, converts centroids to hex, and posts the palette.

- **`kMeans(points, k, maxIter = 10)`**  
  Clusters RGB points into `k` groups by iteratively assigning points to nearest centroids and recalculating centroids.

- **`dist(a, b)`**  
  Calculates squared Euclidean distance between two RGB colors.

- **`rgbToHex(rgb)`**  
  Converts an RGB array to a hex color string.

## Example

```js
// Assuming you have a canvas context `ctx` and want 5 colors:
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
worker.postMessage({ imageData, colorCount: 5 });

worker.onmessage = (e) => {
  console.log('Palette:', e.data);
};
```

## License

MIT License

---

Feel free to customize or extend this worker to fit your needs!