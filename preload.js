(()=>{
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('/systemize.b64.txt')) {
      return nativeFetch(new URL('evidence/systemize.b64.txt', document.baseURI), init);
    }
    return nativeFetch(input, init);
  };
})();
