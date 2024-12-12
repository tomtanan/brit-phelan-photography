import { $, $$ } from 'select-dom';
import { on } from 'utils/helpers';
import { modulesMap } from 'scripts/init';
import { gsap } from 'gsap';

const asyncLoad = (el) => {
  const wrapper = '#main';
  const links = $$('[data-fetch-link]', el);

  // const load = async (url, targetSelector, contentSelector) => {
  const load = async (url, target) => {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Error fetching ${url}`);
      
      const text = await response.text();

      // Parse the fetched HTML and extract the desired content
      const parser = new DOMParser();
      const context = parser.parseFromString(text, 'text/html');
      const targetContent = $(wrapper, context);

      if (targetContent) {

        gsap.to(el, {
          scale: 1.2,
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

            gsap.fromTo(el, {
              scale: 0.8,
              opacity: 0,
            }, {
              scale: 1,
              opacity: 1,
              ease: 'power3.out',
              duration: 0.5,
            });
          },
        });
      } else {
        console.error(`Content selector '${target}' not found in ${url}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  links.forEach((item) => {
    on(item, 'click', (e) => {
      e.preventDefault();
      const url = item.getAttribute('href');
      const target = item.getAttribute('data-fetch-target');
      load(url, target);
    });
  });
};

export default asyncLoad;
