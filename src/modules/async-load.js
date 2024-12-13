import { $, $$ } from 'select-dom';
import { on, off } from 'utils/helpers';
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
              opacity: 0,
            }, {
              opacity: 1,
              ease: 'power3.out',
              duration: 0.5,
            });
            
            asyncLoad(el);
          },
        });
      } else {
        console.error(`Content selector '${target}' not found in ${url}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    const url = item.getAttribute('href');
    const target = item.getAttribute('data-fetch-target');
    load(url, target);
  }

  links.forEach((item) => {
    off(item, 'click', (e) => handleClick(e, item));
    on(item, 'click', (e) => handleClick(e, item));
  });
};

export default asyncLoad;
