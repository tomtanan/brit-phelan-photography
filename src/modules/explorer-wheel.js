import { $$ } from 'select-dom';
import { gsap } from 'gsap';
import { on, isTouchDevice } from 'utils/helpers';

const explorerWheel = (el) => {
  const sections = $$('.js-explorer-featured'); // Select all sections

  if (isTouchDevice()) {
    // Set default position for touch devices
    gsap.set(el, { top: 0, left: 0, opacity: 0 }); // Hide by default
    return;
  }

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Smoothly animate the element to follow the mouse with offset
    gsap.to(el, {
      x: clientX,
      y: clientY,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const onMouseEnter = (e) => {
    const { clientX, clientY } = e;

    // Set the initial position of the element near the mouse cursor
    const offsetX = -90; // Same offset used in onMouseMove
    const offsetY = -90;

    gsap.set(el, {
      x: clientX + offsetX,
      y: clientY + offsetY,
    });

    // Fade in the element
    gsap.to(el, { opacity: 1, duration: 0.3, ease: 'power1.inOut' });
  };

  const onMouseLeave = (e) => {
    // Fade out the element
    gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
  };

  // Attach event listeners for each section
  sections.forEach((section) => {
    on(section, 'mousemove', onMouseMove);
    on(section, 'mouseenter', onMouseEnter);
    on(section, 'mouseleave', onMouseLeave);
  });
};

export default explorerWheel;
