import { $$ } from 'select-dom';
import { on, isTouchDevice } from 'utils/helpers';
import { gsap } from "gsap";

const imageFlow = (el) => {
  // Disable module on touch devices
  if (isTouchDevice()) return () => {};

  const items = $$('.featured-container', el);

  const parallaxHandler = (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    // Normalize mouse position relative to the window
    const xPercent = (clientX / innerWidth - 0.5) * 20;
    const yPercent = (clientY / innerHeight - 0.5) * 20;

    items.forEach((item) => {
      // Get custom intensity from data attribute or default to 1
      const intensity = parseFloat(item.getAttribute('data-parallax-intensity')) || 1;

      gsap.to(item, {
        x: xPercent * intensity,
        y: yPercent * intensity,
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  };
  
  // Hover effect for scaling images
  items.forEach((item) => {
    const image = item.querySelector('.featured-image');

    // Scale up on hover
    on(item, 'mouseenter', () => {
      gsap.to(item, {
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(image, {
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    // Scale down on hover out
    on(item, 'mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  });

  // Attach mousemove listener to the window
  on(window, 'mousemove', parallaxHandler);

  // Cleanup function
  el.cleanup = () => {
    off(window, 'mousemove', parallaxHandler);
  };

  return () => {
    if (el.cleanup) el.cleanup();
  };
}

export default imageFlow;