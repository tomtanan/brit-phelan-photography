import fetchContent from '../modules/fetch-content.js';
import contact from '../modules/contact.js';
import explorer from '../modules/explorer.js';
import imageFlow from '../modules/image-flow.js';
import explorerWheel from '../modules/explorer-wheel.js';
import gallery from '../modules/gallery.js';
import slideshow from '../modules/slideshow.js';

// Mapping of data-module values to imported modules
const modulesMap = {
  'fetch-content': fetchContent,
  'contact': contact,
  'explorer': explorer,
  'image-flow': imageFlow,
  'explorer-wheel': explorerWheel,
  'gallery': gallery,
  'slideshow': slideshow
};

// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module === 'function') {
      module(element); // Initialize the module, passing in the element if necessary
    } else {
      console.error(`No module found for: ${moduleName}`);
    }
  });
});