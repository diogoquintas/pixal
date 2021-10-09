// USE THE ACCOUNT ADDRESS TO BUILD THIS KEY
const KEY = `${process.env.REACT_APP_NAME}_user_pixels`;

export function storageGetPixels() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function storageUpdatePixels(pixels) {
  window.localStorage.setItem(KEY, JSON.stringify(pixels));
}

export function storageSavePixel(id, color) {
  const pixels = storageGetPixels();

  window.localStorage.setItem(KEY, JSON.stringify({ ...pixels, [id]: color }));
}

export function storageDeletePixel(id) {
  const { [id]: pointToDelete, ...remainingPoints } = storageGetPixels();

  window.localStorage.setItem(KEY, JSON.stringify(remainingPoints));
}

export function storageClearAllPixels() {
  window.localStorage.setItem(KEY, JSON.stringify({}));
}
