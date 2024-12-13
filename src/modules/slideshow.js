import { $, $$ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import { gsap } from 'gsap';
import emitter from 'utils/events';


const slideshow = (el) => {
  const featured = $$('.js-slideshow-featured-item', el);
  const prev = $('.js-slideshow-nav-prev', el);
  const next = $('.js-slideshow-nav-next', el);
  const thumbsGroup = $('.js-slideshow-thumbs-group', el);
  const thumbs = $$('.js-slideshow-thumb-link', el);
  let currIndex = 0;

  const resetStates = () => {
    featured.forEach((item) => removeClass(item, 'active'));
    thumbs.forEach((item) => removeClass(item, 'active'));
  }

  const updateActiveItem = (index) => {
    currIndex = index;
    resetStates();
    addClass(featured[index], 'active');
    addClass(thumbs[index], 'active');
  }

  const moveThumbs = (index) => {
    const thumbsPosition = -index * thumbs[0].getBoundingClientRect().width + 'px';

    gsap.to(thumbsGroup, {
      x: thumbsPosition,
      duration: 1,
      ease: 'power2.out',
    });
  }

  const navigate = (direction) => {
    const index = (currIndex + direction + featured.length) % featured.length;

    updateActiveItem(index);
    moveThumbs(index);
  }

  on(prev, 'click', () => navigate(-1));
  on(next, 'click', () => navigate(1));

  thumbs.forEach((item, index) => {
    on(item, 'click', () => {
      currIndex = index;
      updateActiveItem(index);
      moveThumbs(index);
    });
  });

  const timeline = gsap.timeline();

  emitter.on('modal:open', ({ index }) => {
    const currImage = $('.js-slideshow-featured-photo', featured[index]);
    const thumbsPosition = -index * thumbs[0].getBoundingClientRect().width + 'px';

    updateActiveItem(index);

    timeline
      .fromTo(currImage, { 
        scale: 0.8,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
      })
      .fromTo(prev, { 
        x: '-10vw',
        opacity: 0,
      }, {
        x: '0vw',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, '<0.5')
      .fromTo(next, { 
        x: '10vw',
        opacity: 0,
      }, {
        x: '0vw',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      }, '<')
      .fromTo(thumbsGroup, { 
        x: '50%',
        opacity: 0,
      }, {
        x: thumbsPosition,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }, '<');
  });
};

export default slideshow;
