import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';
import { on, addClass, removeClass, isTouchDevice } from 'utils/helpers';
import emitter from 'utils/events';
import throttle from 'lodash.throttle';

const gallery = (el) => {
  const header = $('.js-gallery-header', document);
  const container = $('.js-gallery-wrapper', el);
  const items = $$('.js-gallery-item', el);
  const photos = $$('.js-gallery-item-photo', el);
  const grid = $('.js-gallery-list', el);
  const modal = $('.js-gallery-modal', el);
  const modalClose = $('.js-gallery-modal-close', el);

  const animateItem = (item, index) => {
    gsap.fromTo(item, {
      opacity: 0,
      scale: 0.5,
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay: Math.random(),
      ease: 'power3.out'
    });
  }
  const onLoadAnimation = () => {
    gsap.set(grid, { x: '-50%', y: '-50%' });

    items.forEach((item, index) => {
      const photo = $('.js-gallery-item-photo', item);

      if (photo.complete) {
        animateItem(item, index);
      } else {
        photo.onload = () => {
          animateItem(item, index);
        };
      }
    });
  
    // Animate header children
    gsap.fromTo(header.children, { 
      y: 50, 
      opacity: 0 
    }, { 
      y: 0, 
      opacity: 1, 
      duration: 0.5,
      ease: 'power3.out'
    });
  };
  

  // Grid movement handler
  const onMouseMove = throttle((e) => {
    const containerRect = container.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    
    const xPercent = (e.clientX - containerRect.left) / containerRect.width;
    const yPercent = (e.clientY - containerRect.top) / containerRect.height;
    
    const maxX = Math.max(0, gridRect.width - containerRect.width);
    const maxY = Math.max(0, gridRect.height - containerRect.height);
    
    const x = xPercent * maxX - maxX / 2;
    const y = yPercent * maxY - maxY / 2;
    
    const adjustedX = -x - gridRect.width / 2;
    const adjustedY = -y - gridRect.height / 2;

    // if (firstMove) {
    // }
    gsap.to(grid, {
      x: adjustedX,
      y: adjustedY,
      ease: 'power3.out',
      duration: 0.5,
      overwrite: 'all',
    });
  }, 20);

  // Item mouse enter handler
  const onItemMouseEnter = (photo) => () => {
    gsap.killTweensOf(photos);

    // Reset all photos' zIndex
    photos.forEach((item) => gsap.set(item, { zIndex: 2 }));

    gsap.to(photo, { 
      scale: 1.1, 
      zIndex: 4, 
      ease: 'power3.out', 
      duration: 0.5, 
    });
  };

  // Item mouse leave handler
  const onItemMouseLeave = (photo) => () => {
    gsap.killTweensOf(photos);

    gsap.to(photo, {
      scale: 1,
      ease: 'power3.out', 
      duration: 0.5, 
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(photo, { zIndex: 2 });
      },
    });
  };

  // Item click handler
  const onItemClick = (item) => () => {
    const index = items.indexOf(item);
    emitter.emit('modal:open', { index });
    addClass(modal, 'active');
  };

  // Modal close handler
  const onModalCloseClick = () => {
    removeClass(modal, 'active');
  };

  // Initialization function
  const initGallery = () => {
    // Add event listeners
    if (isTouchDevice()) {
      const sensitivity = 2;
      let startX = 0, startY = 0;

      container.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
      });
      
      container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const deltaX = (touch.clientX - startX) * sensitivity;
        const deltaY = (touch.clientY - startY) * sensitivity;
      
        gsap.to(grid, {
          x: `+=${deltaX}`,
          y: `+=${deltaY}`,
          ease: 'power3.out',
          duration: 0.3,
          overwrite: 'auto',
        });
      
        startX = touch.clientX;
        startY = touch.clientY;
      });
    } else {
      on(window, 'mousemove', onMouseMove);
    }

    items.forEach((item) => {
      const photo = $('.js-gallery-item-photo', item);

      on(item, 'mouseenter', onItemMouseEnter(photo));
      on(item, 'mouseleave', onItemMouseLeave(photo));
      on(item, 'click', onItemClick(item));
    });

    on(modalClose, 'click', onModalCloseClick);

    // Trigger load animation
    onLoadAnimation();
  };

  // Call the initialization function
  initGallery();
};

export default gallery;
