// utils/colorWorker.ts

self.onmessage = (e) => {
  const { imageData, colorCount } = e.data;

  const data = imageData.data;
  const pixels: number[][] = [];

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue;
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  const clusters = kMeans(pixels, colorCount);

  const palette = clusters.map((c) => rgbToHex(c.centroid));

  self.postMessage(palette);
};

function kMeans(points: number[][], k: number, maxIter = 10) {
  let centroids = points.slice(0, k);

  for (let iter = 0; iter < maxIter; iter++) {
    const clusters = Array<number | never | unknown>(k)
      .fill(null)
      .map(() => []);
    for (const p of points) {
      let bestIndex = 0;
      let bestDist = dist(p, centroids[0]);
      for (let i = 1; i < k; i++) {
        const d = dist(p, centroids[i]);
        if (d < bestDist) {
          bestDist = d;
          bestIndex = i;
        }
      }
      clusters[bestIndex].push(p as never);
    }
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0];
      const mean = [0, 0, 0];
      for (const p of cluster) {
        mean[0] += p[0];
        mean[1] += p[1];
        mean[2] += p[2];
      }
      mean[0] /= cluster.length;
      mean[1] /= cluster.length;
      mean[2] /= cluster.length;
      return mean;
    });
  }

  return centroids.map((c) => ({ centroid: c }));
}

function dist(a: number[], b: number[]) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function rgbToHex(rgb: number[]) {
  return (
    "#" +
    rgb
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
