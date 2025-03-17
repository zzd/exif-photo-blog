'use client';

import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { ComponentProps, useCallback, useState, ReactNode } from 'react';
import { GRID_SPACE_CLASSNAME } from '@/components';

export default function PhotoGridContainer({
  cacheKey,
  photos,
  count,
  tag,
  camera,
  lens,
  simulation,
  focal,
  recipe,
  animateOnFirstLoadOnly,
  header,
  sidebar,
  canSelect,
}: {
  cacheKey: string
  count: number
  header?: ReactNode
  sidebar?: ReactNode
} & ComponentProps<typeof PhotoGrid>) {
  const [
    shouldAnimateDynamicItems,
    setShouldAnimateDynamicItems,
  ] = useState(false);

  const onAnimationComplete = useCallback(() =>
    setShouldAnimateDynamicItems(true), []);

  return (
    <SiteGrid
      contentMain={<div className={clsx(
        header && 'space-y-8 mt-1.5',
      )}>
        {header &&
          <AnimateItems
            type="bottom"
            items={[header]}
            animateOnFirstLoadOnly
          />}
        <div className={GRID_SPACE_CLASSNAME}>
          <PhotoGrid {...{
            photos,
            tag,
            camera,
            lens,
            simulation,
            focal,
            recipe,
            animateOnFirstLoadOnly,
            onAnimationComplete,
            canSelect,
          }} />
          {count > photos.length &&
            <PhotoGridInfinite {...{
              cacheKey,
              initialOffset: photos.length,
              canStart: shouldAnimateDynamicItems,
              tag,
              camera,
              lens,
              simulation,
              focal,
              recipe,
              animateOnFirstLoadOnly,
              canSelect,
            }} />}
        </div>
      </div>}
      contentSide={sidebar}
      sideHiddenOnMobile
    />
  );
}
