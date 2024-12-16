import { $, $$ } from 'select-dom';
import { on, addClass, removeClass, isTouchDevice } from 'utils/helpers';
import global from 'utils/global';
import { gsap } from 'gsap';

let timeline = null;
let isAnimating = false;

const explorer = (el) => {
  const main = $('#main');
  const tabs = $$('.js-explorer-tab', el);
  const contents = $$('.js-explorer-featured', el);
  const images = $$('.js-explorer-image', el);
  const prev = $('.js-explorer-prev', el);
  const next = $('.js-explorer-next', el);
  const wheel = $('.js-explorer-wheel', el);
  const paths = $$('.js-wheel-path', wheel);

  const onLoadAnimation = () => {
    gsap.fromTo(tabs, {
      x: -100,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      duration: 0.5,
      delay: 0.3,
      stagger: 0.1, 
      ease: 'power3.out',
    });
  }

  const animate = (prevContent, nextContent) => {
    // Lock parallax during animations
    global.parallax = true;

    // Kill any ongoing timeline, but finish in-progress animations gracefully
    if (timeline) {
      timeline.progress(1);
    }

    const prevItems = $$('.js-explorer-item', prevContent);
    const nextItems = $$('.js-explorer-item', nextContent);

    isAnimating = true;

    timeline = gsap.timeline({
      onComplete: () => {
        global.parallax = false;
        timeline = null;
        isAnimating = false;
      },
    });

    prevItems.forEach((item) => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 1;
      timeline.fromTo(item, {
        x: '0vw',
        opacity: 1
      }, {
        x: '-100vw',
        opacity: 0,
        duration: speed,
        ease: 'power2.in',
      }, 0);
    });

    nextItems.forEach((item) => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 1;
      timeline.fromTo(item, { 
        x: '100vw',
        opacity: 0 
      }, {
        x: '0vw',
        opacity: 1,
        duration: speed,
        ease: 'power2.out',
      }, 0.7);
    });
  };

  const selectGallery = (tab, content, init = false) => {
    const curr = $('.js-explorer-featured.active', el);
    const color = $('.js-explorer-color', content).style.backgroundColor;

    if (!init) animate(curr, content);

    removeClass(tabs, 'active');
    addClass(tab, 'active');
    
    removeClass(contents, 'active');
    addClass(content, 'active');

    main.style.backgroundColor = color;

    const index = tabs.findIndex((tab) => tab.classList.contains('active'));

    updateGalleryNav(index);
    updateWheel(tab);
  };
  
  const updateGalleryNav = (index) => {
    if (index === 0) {
      removeClass(prev, 'active');
    } else if (!prev.classList.contains('active')) {
      addClass(prev, 'active');
    }

    if (index === tabs.length - 1) {
      removeClass(next, 'active');
    } else if (!next.classList.contains('active')) {
      addClass(next, 'active');
    }
  }

  const updateWheel = (tab) => {
    const word = tab.getAttribute('data-content').toUpperCase();

    paths.forEach((item) => {
      item.textContent = word;
    });
  }

  const navigateGallery = (step = 1) => {
    const index = tabs.findIndex((tab) => tab.classList.contains('active'));
    const newIndex = index + step;

    if (newIndex < 0 || newIndex >= tabs.length || isAnimating) return;

    selectGallery(tabs[newIndex], contents[newIndex]);
  }

  const updateWheelColors = (color) =>{
    const text = wheel.querySelectorAll('.js-wheel-text', wheel);

    text.forEach((item) => {
      item.style.fill = color;
    });
    wheel.style.color = color;
  }

  const initExplorer = () => {
    selectGallery(tabs[0], contents[0], true);
    addClass(next, 'active');
    onLoadAnimation();

    tabs.forEach((item) => {
      on(item, 'click', () => {
        const slug = item.getAttribute('data-content');
        const content = $(`.js-explorer-featured[data-tab="${slug}"]`, el);
  
        if (content.classList.contains('active') || isAnimating) return;
  
        selectGallery(item, content);
      });
    });
  
    on(prev, 'click', () => {
      if (!prev.classList.contains('active')) return;
      
      navigateGallery(-1);
    });
  
    on(next, 'click', () => {
      if (!next.classList.contains('active')) return;
  
      navigateGallery(1);
    });


    images.forEach((item) => {
      on(item, 'mouseenter', () => {
        updateWheelColors('#fff')
      });
      on(item, 'mouseleave', () => {
        updateWheelColors('#0c0c0c')
      });
    });
  };

  initExplorer();
};

export default explorer;
