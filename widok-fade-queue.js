import $ from 'cash-dom';
import throttle from 'widok-throttle';

/**
 * @typedef {Object} options
 * @property {number} delay default = 100, delay between consequtive activations
 * @property {string} selector default = '.fade', selector of fading elements
 * @property {number} screenPosition default = 1, portion of the screen where activation occurs
 */

/**
 * Enables fading activation.
 * @param {options} options
 */

function fadeQueueStart(options = {}) {
  const opt = {
    delay: 100,
    selector: '.fade',
    screenPosition: 1,
  };
  Object.assign(opt, options);
  const fadeOnResize = () => fades.forEach(e => e.resize());
  const fadeOnScroll = () => fades.forEach(e => e.check());
  const checkFadeQueue = () => {
    if (fadeQueue.length === 0) return;
    const target = fadeQueue.splice(0, 1)[0];
    target.inQueue = false;
    const isDisplayed = target.check();
    if (fadeQueue.length > 0) {
      if (isDisplayed) setTimeout(checkFadeQueue, opt.delay);
      else checkFadeQueue();
    }
  };

  let nextOrder = 1000;
  let lastActivated;
  class Fade {
    constructor(element) {
      this.element = $(element);
      this.active = false;
      this.inQueue = false;
      const order = this.element.data('fade-order');
      this.order = order === undefined ? nextOrder++ : order;
    }

    resize() {
      this.offset = this.element.offset().top;
      this.isFixed = this.element.css('position') === 'fixed';
      this.check();
    }

    check() {
      if (this.inQueue) return false;
      if (this.isFixed) {
        this.activate();
        return false;
      }

      if (
        this.offset <
        window.scrollY + window.innerHeight * opt.screenPosition
      ) {
        this.activate();
        return true;
      }
      this.deactivate();
      return false;
    }

    activate() {
      if (this.active) return;

      const now = new Date().getTime();
      if (now >= lastFade + opt.delay || lastActivated === this.order) {
        this.active = true;
        this.element.addClass('active');

        lastFade = now;
        lastActivated = this.order;
      } else {
        this.inQueue = true;
        fadeQueue.push(this);
        if (fadeQueue.length === 1) {
          setTimeout(checkFadeQueue, opt.delay);
        }
      }
    }

    deactivate() {
      if (!this.active) return;

      this.active = false;
      this.element.removeClass('active');
    }
  }

  let lastFade = 0;
  const fadeQueue = [];
  const fades = [];

  $(opt.selector).each((index, element) => {
    fades.push(new Fade(element));
  });
  fades.sort((a, b) => a.order - b.order);

  window.addEventListener('load', fadeOnResize);
  window.addEventListener('resize', throttle(100, fadeOnResize));
  window.addEventListener('scroll', throttle(100, fadeOnScroll));
}

export default fadeQueueStart;
