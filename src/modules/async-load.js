import { $, $$ } from 'select-dom';
import { on, off } from 'utils/helpers';
import { modulesMap } from 'scripts/init';
import { gsap } from 'gsap';

const asyncLoad = (el) => {
  const wrapper = '#main';
  const links = $$('[data-fetch-link]', document);
  const cachedPages = new Map(); // Cache for preloaded pages
  
  const preloadContent = (url) => {
    if (!cachedPages.has(url)) {
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to preload ${url}`);
          return response.text();
        })
        .then((html) => {
          cachedPages.set(url, html); // Cache the HTML content
        })
        .catch((error) => {
          console.error(`Error preloading ${url}:`, error);
          cachedPages.set(url, null); // Mark failed attempts to allow fallback
        });
    }
  };

  const load = async (url, target) => {
    try {
      // Check if content is cached
      if (cachedPages.has(url) && cachedPages.get(url) !== null) {
        const cachedHTML = cachedPages.get(url);
        updateContent(cachedHTML, url, el, wrapper);
        return;
      }

      const response = await fetch(url);

      if (!response.ok) throw new Error(`Error fetching ${url}`);

      const text = await response.text();
      cachedPages.set(url, text); // Cache the fetched content
      updateContent(text, url, el, wrapper);
    } catch (err) {
      console.error(err);
      // Fallback: Allow the link to behave normally by navigating
      window.location.href = url;
    }
  };

  const updateContent = (html, url, el, wrapper) => {
    const parser = new DOMParser();
    const context = parser.parseFromString(html, 'text/html');
    const targetContent = $(wrapper, context);

    if (targetContent) {
      gsap.to(el, {
        opacity: 0,
        ease: 'power3.out',
        duration: 0.5,
        onComplete: () => {
          el.innerHTML = targetContent.innerHTML;
          history.pushState(null, '', url);

          const instances = $$('[data-module]', el);
          instances.forEach((item) => {
            const moduleName = item.getAttribute('data-module');
            const module = modulesMap[moduleName];

            if (module && typeof module === 'function') {
              module(item);
            } else {
              console.error(`No module found for: ${moduleName}`);
            }
          });

          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, ease: 'power3.out', duration: 0.5 });
          asyncLoad(el);
        },
      });
    } else {
      console.error(`Content selector '${wrapper}' not found in ${url}`);
      window.location.href = url; // Fallback: Allow normal navigation if the content is missing
    }
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    const url = item.getAttribute('href');
    const target = item.getAttribute('data-fetch-target') || wrapper;
    load(url, target);
  };

  links.forEach((item) => {
    const url = item.getAttribute('href');

    off(item, 'click', (e) => handleClick(e, item));
    on(item, 'click', (e) => handleClick(e, item));

    if (url) {
      preloadContent(url); // Dynamically preload the linked content
    }
  });
};

export default asyncLoad;
