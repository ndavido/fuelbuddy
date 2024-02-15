'use strict';

import { useRef } from 'react';
import { makeMutable } from './core';
export function makeViewDescriptorsSet() {
  const shareableViewDescriptors = makeMutable([]);
  const data = {
    shareableViewDescriptors,
    add: item => {
      shareableViewDescriptors.modify(descriptors => {
        'worklet';

        const index = descriptors.findIndex(descriptor => descriptor.tag === item.tag);
        if (index !== -1) {
          descriptors[index] = item;
        } else {
          descriptors.push(item);
        }
        return descriptors;
      }, false);
    },
    remove: viewTag => {
      shareableViewDescriptors.modify(descriptors => {
        'worklet';

        const index = descriptors.findIndex(descriptor => descriptor.tag === viewTag);
        if (index !== -1) {
          descriptors.splice(index, 1);
        }
        return descriptors;
      }, false);
    }
  };
  return data;
}
export function useViewRefSet() {
  const ref = useRef(null);
  if (ref.current === null) {
    const data = {
      items: new Set(),
      add: item => {
        if (data.items.has(item)) return;
        data.items.add(item);
      },
      remove: item => {
        data.items.delete(item);
      }
    };
    ref.current = data;
  }
  return ref.current;
}
//# sourceMappingURL=ViewDescriptorsSet.js.map