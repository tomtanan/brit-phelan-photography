import { $, $$ } from 'select-dom';
import { on, isTouchDevice } from 'utils/helpers';
import global from 'utils/global';
import { gsap } from "gsap";

const imageFlow = (el) => {
  if (isTouchDevice()) return () => {};

  const items = $$('.js-explorer-item', el);

  const parallaxHandler = (event) => {
    if (global.parallax) return; // Stop parallax if animations are active

    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const xPercent = (clientX / innerWidth - 0.5) * 20;
    const yPercent = (clientY / innerHeight - 0.5) * 20;

    items.forEach((item) => {
      const intensity = parseFloat(item.getAttribute('data-intensity')) || 1;

      gsap.to(item, {
        x: xPercent * intensity,
        y: yPercent * intensity,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  };

  items.forEach((item) => {
    const image = $('.js-explorer-image', item);

    on(item, 'mouseenter', () => {
      if (global.parallax) return;
      gsap.to(item, { scale: 0.95, duration: 0.5, ease: 'power2.out' });
      gsap.to(image, { scale: 1.05, duration: 0.5, ease: 'power2.out' });
    });

    on(item, 'mouseleave', () => {
      if (global.parallax) return;
      gsap.to(item, { scale: 1, duration: 0.5, ease: 'power2.out' });
      gsap.to(image, { scale: 1, duration: 0.5, ease: 'power2.out' });
    });
  });

  on(window, 'mousemove', parallaxHandler);

  return () => {
    off(window, 'mousemove', parallaxHandler);
  };
};

export default imageFlow;
