export const splitIntoWords = (elements) => {
  // If 'elements' is a NodeList or an array, iterate through them
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    elements.forEach((element) => splitIntoWords(element));
    return;
  }

  // Ensure node is valid and not already processed
  const node = elements;
  if (!node || !(node instanceof Node)) throw new Error('Expected a DOM Node.');

  // If it's a text node, split the words and wrap them in spans
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const fragment = document.createDocumentFragment();
    const words = node.textContent.trim().split(/\s+/);
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      if (word !== '.' && word !== '!') {
        fragment.appendChild(document.createTextNode(' ')); // Add space before each word
      }
      fragment.appendChild(span);
    });
    node.replaceWith(fragment); // Replace the entire text node at once
    return; // Early return as we don't need to process further
  }

  // If it's an element node, process its children
  if (node.nodeType === Node.ELEMENT_NODE) {
    // If the node is an inline span but not already a 'word', apply the class and skip re-wrapping
    if (node.tagName.toLowerCase() === 'span' && !node.classList.contains('word')) {
      node.classList.add('word');
      return; // Don't process its children further
    }

    // Process only the text node children, leave already wrapped spans untouched
    Array.from(node.childNodes).forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE || childNode.nodeType === Node.ELEMENT_NODE) {
        splitIntoWords(childNode);
      }
    });
  }
};

// Checks if the device is a touch device.
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

export const on = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
};

export const off = (element, event, handler) => {
  element.removeEventListener(event, handler);
};