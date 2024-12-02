import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';
import { on } from 'utils/helpers';
import throttle from 'lodash.throttle';

const gallery = (el) => {
    const container = $('.js-gallery-wrapper', el);
    const items = $$('.js-gallery-item', el);
    const photos = $$('.js-gallery-item-photo', el);
    const grid = $('.js-gallery-list', el);

    // Initialize the grid position
    gsap.set(grid, { x: 0, y: 0 });

    // Handle grid movement with mouse
    on(window, 'mousemove', throttle((e) => {
        const containerRect = container.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();

        const xPercent = (e.clientX - containerRect.left) / containerRect.width;
        const yPercent = (e.clientY - containerRect.top) / containerRect.height;

        const maxX = -(gridRect.width - containerRect.width) / 2;
        const maxY = -(gridRect.height - containerRect.height) / 2;

        const x = xPercent * 2 * maxX - maxX;
        const y = yPercent * 2 * maxY - maxY;

        gsap.to(grid, {
            x: x,
            y: y,
            ease: 'power3.out',
            duration: 0.5,
            overwrite: true,
        });
    }, 20));

    // Handle item interactions
    items.forEach((item) => {
        const overlay = $('.js-gallery-item-overlay', item);
        const photo = $('.js-gallery-item-photo', item);

        on(item, 'mouseenter', () => {
          gsap.killTweensOf(photos);
          
          // Reset all photos' zIndex
          photos.forEach((p) => gsap.set(p, { zIndex: 2 }));

          // Animate the hovered photo and overlay
          gsap.to(overlay, { 
            opacity: 0.8, 
            ease: 'power3.out', 
            duration: 0.5, 
          });
          gsap.to(photo, { 
            scale: 1.1, 
            zIndex: 4, 
            ease: 'power3.out', 
            duration: 0.5, 
          });
        });

        on(item, 'mouseleave', () => {
          // Animate the photo and overlay back to default
          gsap.to(overlay, { 
            opacity: 0, 
            ease: 'power3.out', 
            duration: 0.5, 
          });
          gsap.to(photo, {
              scale: 1,
              ease: 'power3.out', 
              duration: 0.5, 
              onComplete: () => {
                  gsap.set(photo, { zIndex: 2 }); // Reset zIndex after opacity animation
              },
          });
        });
    });
};

export default gallery;
