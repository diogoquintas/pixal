const KEY = `${process.env.REACT_APP_NAME}_user_pixels`;

export function storageGetPoints() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch (err) {
    console.log(err);
    return {};
  }
}

export function storageSavePont(id, color) {
  const points = storageGetPoints();

  window.localStorage.setItem(KEY, JSON.stringify({ ...points, [id]: color }));
}

export function storageDeletePoint(id) {
  const { [id]: pointToDelete, ...remainingPoints } = storageGetPoints();

  window.localStorage.setItem(KEY, JSON.stringify(remainingPoints));
}

export function storageClearAllPoints() {
  window.localStorage.setItem(KEY, JSON.stringify({}));
}
