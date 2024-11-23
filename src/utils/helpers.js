/**
 * Checks if the device is a touch device.
 *
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Toggles the specified class on an element
export const toggleClass = (el, className) => el.classList.toggle(className);

// Adds one or more classes to an element or array of elements, accepting both space-separated strings or multiple arguments
export const addClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' ')); // Split any space-separated strings into individual class names
  const elements = Array.isArray(el) ? el : [el]; // Ensure el is an array of elements

  elements.forEach(element => {
    if (element instanceof Element) {
      element.classList.add(...classes); // Add all classes to each element
    }
  });
};

// Removes one or more classes from an element or array of elements, accepting both space-separated strings or multiple arguments
export const removeClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' ')); // Split any space-separated strings into individual class names
  const elements = Array.isArray(el) ? el : [el]; // Ensure el is an array of elements

  elements.forEach(element => {
    if (element instanceof Element) {
      element.classList.remove(...classes); // Remove all classes from each element
    }
  });
};

/**
 * Attaches an event listener to a specified DOM element.
 * Supports optional event listener options like { once: true }.
 * @param {Element} element - The DOM element to attach the event listener to.
 * @param {string} event - The event to listen for (e.g., 'click', 'mouseover').
 * @param {Function} handler - The function to run when the event occurs.
 * @param {Object} [options] - Optional event listener options (e.g., { once: true }).
 */
export const on = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
};