import { $, $$ } from 'select-dom';
import { on } from 'utils/helpers';

const fetchContent = (el) => {
  console.log(el);

  const links = $$('[data-fetch]');

  console.log(links);

  // const load = async (url, targetSelector, contentSelector) => {
  const load = async (url, wrapper, target) => {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Error fetching ${url}`);
      
      const text = await response.text();

      // Parse the fetched HTML and extract the desired content
      // const parser = new DOMParser();
      // const context = parser.parseFromString(text, 'text/html');
      // const targetContent = $(target, context);

      // if (targetContent) {
      //   const wrapperElement = $(wrapper, el);
      //   $(wrapper).innerHTML = targetContent.innerHTML;
      // } else {
      //   console.error(`Content selector '${target}' not found in ${url}`);
      // }
    } catch (err) {
      console.error(err);
    }
  };

  links.forEach((item) => {
    on(el, 'click', (e) => {
      e.target.preventDefault();
      const url = item.getAttribute('href');
      const wrapper = item.getAttribute('data-fetch-wrapper');
      const target = item.getAttribute('data-fetch-target');
      load(url, wrapper, target);
    });
  });
};

export default fetchContent;
