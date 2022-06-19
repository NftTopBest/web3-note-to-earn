export function blobToDataURL(blob) {
  return new Promise((resolve) => {
    const a = new FileReader();
    a.onload = function (e) {
      resolve(e.target.result);
    };
    a.readAsDataURL(blob);
  });
}

export function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);

  return new Blob([u8arr], { type: mime });
}
