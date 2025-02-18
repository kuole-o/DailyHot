export function debounce(func, delay) {
  let timeoutId;
  const debounced = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
  // 添加 cancel 方法
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };
  return debounced;
}