import { nextTick } from 'vue';
import type { Router } from 'vue-router';

const scrollPositions = new Map<string, number>();

function getScrollEl(): HTMLElement | Window {
  const el = document.querySelector('[data-scroll-container]') as HTMLElement;
  if (el) return el;
  return window;
}

function getScrollTop(): number {
  const el = getScrollEl();
  if (el === window) return window.scrollY;
  return (el as HTMLElement).scrollTop;
}

function setScrollTop(value: number) {
  const el = getScrollEl();
  if (el === window) {
    window.scrollTo(0, value);
  } else {
    (el as HTMLElement).scrollTop = value;
  }
}

export function setupKeepScroll(router: Router) {
  router.beforeEach((to, from) => {
    if (from.name) {
      scrollPositions.set(from.name as string, getScrollTop());
    }
  });

  router.afterEach((to) => {
    if (to.name) {
      const saved = scrollPositions.get(to.name as string);
      nextTick(() => {
        setScrollTop(saved ?? 0);
      });
    }
  });
}
