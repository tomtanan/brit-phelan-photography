import { $, $$ } from 'select-dom';
import { on, addClass, removeClass } from 'utils/helpers';
import global from 'utils/global';
import { gsap } from 'gsap';

let timeline = null;
let isAnimating = false;

const explorer = (el) => {
  const tabs = $$('.js-explorer-tab', el);
  const contents = $$('.js-explorer-featured', el);
  const background = $('.js-explorer-background', el);
  const prev = $('.js-explorer-prev', el);
  const next = $('.js-explorer-next', el);
  const wheel = $('.js-explorer-wheel', el);
  const paths = $$('.js-wheel-path', wheel);

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

    background.style.backgroundColor = color;

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

  const initExplorer = () => {
    selectGallery(tabs[0], contents[0], true);
    addClass(next, 'active');

  };

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

  initExplorer();
};

export default explorer;
