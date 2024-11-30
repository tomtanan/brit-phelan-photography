import { gsap } from 'gsap';
import throttle from 'lodash.throttle'; // Use lodash throttle

const gallery = (el) => {
    const container = el.querySelector('.js-gallery-wrapper');
    const grid = el.querySelector('.js-gallery-list');

    gsap.set(grid, { x: 0, y: 0 });

    container.addEventListener('mousemove', throttle((event) => {
        const containerRect = container.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();

        const xPercent = (event.clientX - containerRect.left) / containerRect.width;
        const yPercent = (event.clientY - containerRect.top) / containerRect.height;

        const maxX = -(gridRect.width - containerRect.width) / 2;
        const maxY = -(gridRect.height - containerRect.height) / 2;

        const x = xPercent * 2 * maxX - maxX;
        const y = yPercent * 2 * maxY - maxY;

        gsap.to(grid, {
            x: x,
            y: y,
            ease: 'power1.out',
            duration: 0.7,
            overwrite: true,
        });
    }, 20)); // Throttle to 20ms
};

export default gallery;