import React, { useEffect } from 'react';

type UserScrollablePosition = {
  left: number;
  top: number;
  x: number;
  y: number;
};

type UseScrollableOptions = {
  speed?: number;
  horizontal?: boolean;
  allowOverscroll?: boolean;
};

/**
 * @param ref - the React ref to monitor touch and mousemove events
 * @param onScrollUpdate - callback to return the current scroll amount, and position
 * @param options
 */
const useScrollable = (
  ref: React.MutableRefObject<HTMLDivElement>,
  onScrollUpdate?: (value: number) => void,
  options: UseScrollableOptions = {},
) => {
  // set the defaults
  const { speed = 1, horizontal = false, allowOverscroll = false } = options;

  useEffect(() => {
    // give the clean up time run
    const currentRef: React.MutableRefObject<HTMLDivElement>['current'] = ref.current;

    let isDown = false;
    const position: UserScrollablePosition = {
      // the scroll amount
      left: 0, // e.scrollLeft,
      top: 0, // e.scrollTop,

      // the mouse position
      x: 0, // e.clientX,
      y: 0, // e.clientY,
    };

    const startHandler = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      currentRef.classList.add('active');

      if (horizontal) {
        if ('clientX' in e) {
          position.x = e.clientX;
        } else if ('touches' in e) {
          position.x = e.touches[0].clientX;
        }
      } else {
        if ('clientY' in e) {
          position.y = e.clientY;
        } else if ('touches' in e) {
          position.y = e.touches[0].clientY;
        }
      }

      if (horizontal) {
        position.left = currentRef.scrollLeft;
      } else {
        position.top = currentRef.scrollTop;
      }
    };

    const endHandler = () => {
      if (isDown && typeof onScrollUpdate === 'function') {
        onScrollUpdate(horizontal ? currentRef.scrollLeft : currentRef.scrollTop,);
      }

      isDown = false;
      currentRef.classList.remove('active');
    };

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      if (!isDown) {
        return;
      }

      e.preventDefault();

      let startScroll: number = 0;
      let startPosition: number = 0;
      let currentScroll: number = 0;
      if (horizontal) {
        startScroll = position.left;
        startPosition = position.x;

        if ('clientX' in e) {
          currentScroll = e.clientX;
        } else if ('touches' in e) {
          currentScroll = e.touches[0].clientX;
        }
      } else {
        startScroll = position.top;
        startPosition = position.y;

        if ('clientY' in e) {
          currentScroll = e.clientY;
        } else if ('touches' in e) {
          currentScroll = e.touches[0].clientY;
        }
      }

      const jump = (currentScroll - startPosition) * speed;
      const scrollTo: number = startScroll - jump;

      if (horizontal) {
        if (allowOverscroll && scrollTo < 0) {
          currentRef.scrollLeft = currentRef.scrollWidth;
        } else if (allowOverscroll && scrollTo > currentRef.scrollWidth) {
          currentRef.scrollLeft = 0;
        } else {
          currentRef.scrollLeft = scrollTo;
        }
      } else {
        if (allowOverscroll && scrollTo < 0) {
          currentRef.scrollTop = currentRef.scrollHeight;
        } else if (allowOverscroll && scrollTo > currentRef.scrollHeight) {
          currentRef.scrollTop = 0;
        } else {
          currentRef.scrollTop = scrollTo;
        }
      }
    };

    if (currentRef) {
      currentRef.addEventListener(`mousedown`, startHandler);
      currentRef.addEventListener(`mouseleave`, endHandler);
      currentRef.addEventListener(`mouseup`, endHandler);
      currentRef.addEventListener(`mousemove`, moveHandler);
      currentRef.addEventListener(`touchstart`, startHandler);
      currentRef.addEventListener(`touchend`, endHandler);
      currentRef.addEventListener(`touchmove`, moveHandler);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener(`mousedown`, startHandler);
        currentRef.removeEventListener(`mouseleave`, endHandler);
        currentRef.removeEventListener(`mouseup`, endHandler);
        currentRef.removeEventListener(`mousemove`, endHandler);
        currentRef.removeEventListener(`touchstart`, startHandler);
        currentRef.removeEventListener(`touchend`, endHandler);
        currentRef.removeEventListener(`mousemove`, moveHandler);
      }
    };
  }, [ref, onScrollUpdate, allowOverscroll, horizontal, speed]);
};

export { useScrollable, UseScrollableOptions };
