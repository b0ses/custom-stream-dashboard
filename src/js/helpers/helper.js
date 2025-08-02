function debounce(callback, timeout = 300) {
  let timer;
  return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(function () { callback.apply(this, args); }, timeout);
  };
}

export default { debounce };
