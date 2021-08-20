const MAX_SIZE = 500;

/**
 * Simple wrapper to convert bounding box to drawing dimensions,
 * not necessary but it does clean up the view code.
 */
export const getDimensionsFromBoundingBox = (bbox) => {
  return {
    x: bbox.x1 || 0,
    y: bbox.y1 || 0,
    w: (bbox.x2 || 0) - (bbox.x1 || 0),
    h: (bbox.y2 || 0) - (bbox.y1 || 0),
  };
};

/**
 * Wrapping fetchImage in promise instead of callback to keep
 * the async operations consistent in hooks
 */
export const fetchBlobFromUrl = (url) => {
  return new Promise((resolve) => {
    getImageDataFromUrl(url, resolve);
  });
};

/*
Given a URL for an image, gets the binary data for the image. The binary data
is passed to the provided callback function.

Example usage:
getImageDataFromUrl('http://my.image.jpg', function(blob) {
    const formData = new FormData();
    formData.append('image', blob);
    ...
});

from https://stackoverflow.com/a/39593964
*/
export const getImageDataFromUrl = (url, callback) => {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function (a) {
    const canvas = document.createElement("canvas");

    const maxSide = Math.max(img.width, img.height);
    let ratio = 1.0;
    if (maxSide > MAX_SIZE) {
      ratio = MAX_SIZE / maxSide;
    }

    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);

    var dataURI = canvas.toDataURL("image/jpg");

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return callback(new Blob([ia], { type: mimeString }));
  };

  img.src = url;
};
