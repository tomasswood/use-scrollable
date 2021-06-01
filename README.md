# use-scrollable
A react hook for changing an element into a scrollable element.

```javascript
import React, { useRef } from 'react';
import { useScrollable } from 'use-scrollable';

const MyComponent = (props) => {
  const sliderRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const onScrollUpdate = useCallback(
    (value: number) => {
      console.log(value);
    },
    [],
  );

  useScrollable(sliderRef, onScrollUpdate, { allowOverscroll: true, horizontal: true, speed: 2 });

  return (
    <div ref={sliderRef}>
      {props.children}
    </div>
  );
}
```

## Parameters

#### `sliderRef`
```typescript
sliderRef: React.MutableRefObject<T extends HTMLElement>;
```
This is the element that we want to watch for touch or mousemove events.

#### `onScrollUpdate`
```typescript
onScrollUpdate: (value) => void;
```
OnChange event that fires during the following events:
- `mouseleave`
- `mouseup`
- `touchend`

Returning: `currentRef.scrollLeft` if `horizontal = true`, otherwise `currentRef.scrollTop`

#### `options`
```typescript
const { speed = 1, horizontal = false, allowOverscroll = false } = options;
```
List of extra optional configuration options to apply to the plugin.
- `speed` how fast to apply the scroll updates
- `horizontal` watch on the `x` axis rather than the `y` axis
- `allowOverscroll` reset to 0 when `scrollAmount > size` or, set to `size` when `scrollAmount < 0`
