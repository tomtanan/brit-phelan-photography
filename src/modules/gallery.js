import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';
import { on, addClass, removeClass } from 'utils/helpers';
import emitter from 'utils/events';
import throttle from 'lodash.throttle';

const gallery = (el) => {
    const container = $('.js-gallery-wrapper', el);
    const items = $$('.js-gallery-item', el);
    const photos = $$('.js-gallery-item-photo', el);
    const grid = $('.js-gallery-list', el);
    const modal = $('.js-gallery-modal', el);
    const modalClose = $('.js-gallery-modal-close', el);
    let firstMove = true;

    // Handle grid movement with mouse
    const updateGridPosition = throttle((e) => {
      const containerRect = container.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
    
      const xPercent = (e.clientX - containerRect.left) / containerRect.width;
      const yPercent = (e.clientY - containerRect.top) / containerRect.height;
    
      const maxX = Math.max(0, gridRect.width - containerRect.width);
      const maxY = Math.max(0, gridRect.height - containerRect.height);
    
      const x = xPercent * maxX - maxX / 2;
      const y = yPercent * maxY - maxY / 2;
    
      // Adjust Y to account for centering transform
      const adjustedX = -x - gridRect.width / 2;
      const adjustedY = -y - gridRect.height / 2;

      gsap.to(grid, {
        x: adjustedX,
        y: adjustedY,
        ease: 'power3.out',
        duration: 0.5,
        overwrite: 'all',
      });
    }, 20);

    on(window, 'mousemove', updateGridPosition);

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

        on(item, 'click', () => {
          const index = items.indexOf(item);
          emitter.emit('modal:open', { index });
          addClass(modal, 'active');
        })

        on(modalClose, 'click', () => {
          removeClass(modal, 'active');
        })
    });
};

export default gallery;
