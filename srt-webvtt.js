
const blobToBufferOrString = (blob, readAs) => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    /**
     * @param event 
     */
    const loadedCb = (event) => {
      const buf = (event.target).result;
      reader.removeEventListener('loadend', loadedCb);
      resolve(readAs !== 'string' ? new Uint8Array(buf) : buf);
    };

    const errorCb = () => {
      reader.removeEventListener('error', errorCb);
      reject(new Error(`Error while reading the Blob object`));
    };

    reader.addEventListener('loadend', loadedCb);
    reader.addEventListener('error', errorCb);
    if (readAs !== 'string') {
      reader.readAsArrayBuffer(blob);
    } else {
      reader.readAsText(blob);
    }
  });

const blobToURL = (text) => URL
  .createObjectURL(new Blob([text], { type: 'text/vtt' }));

const toVTT = (utf8str) => utf8str
  .replace(/\{\\([ibu])\}/g, '</$1>')
  .replace(/\{\\([ibu])1\}/g, '<$1>')
  .replace(/\{([ibu])\}/g, '<$1>')
  .replace(/\{\/([ibu])\}/g, '</$1>')
  .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
  .concat('\r\n\r\n');

const toWebVTT = async (resource) => {
  let text;
  const vttString = 'WEBVTT FILE\r\n\r\n'; // leading text
  try {
    const buffer = await blobToBufferOrString(resource, 'string');
    text = vttString.concat(toVTT(buffer));
  } catch (e) {
    const buffer = await blobToBufferOrString(resource, 'buffer');
    const decode = new TextDecoder('utf-8').decode(buffer);
    text = vttString.concat(toVTT(decode));
  }
  return Promise.resolve(blobToURL(text));
};
