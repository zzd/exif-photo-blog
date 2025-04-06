'use client';

import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { PhotoDateRange, dateRangeForPhotos, photoQuantityText } from '.';
import { TAG_FAVS, TAG_HIDDEN, addHiddenToTags } from '@/tag';
import PhotoFilm from '@/film/PhotoFilm';
import FavsTag from '../tag/FavsTag';
import { useAppState } from '@/state/AppState';
import { useMemo, useRef } from 'react';
import HiddenTag from '@/tag/HiddenTag';
import { CATEGORY_VISIBILITY } from '@/app/config';
import { clsx } from 'clsx/lite';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import IconCamera from '@/components/icons/IconCamera';
import IconRecipe from '@/components/icons/IconRecipe';
import IconTag from '@/components/icons/IconTag';
import IconFilm from '@/components/icons/IconFilm';
import IconLens from '@/components/icons/IconLens';
import PhotoLens from '@/lens/PhotoLens';
import IconFocalLength from '@/components/icons/IconFocalLength';
import {
  getCategoriesWithItemsCount,
  PhotoSetCategories,
} from '@/category';
import PhotoFocalLength from '@/focal/PhotoFocalLength';
import useElementHeight from '@/utility/useElementHeight';

const APPROXIMATE_ITEM_HEIGHT = 34;
const ABOUT_HEIGHT_OFFSET = 80;

export default function PhotoGridSidebar({
  photosCount,
  photosDateRange,
  containerHeight,
  aboutTextSafelyParsedHtml,
  aboutTextHasBrParagraphBreaks,
  ...categories
}: PhotoSetCategories & {
  photosCount: number
  photosDateRange?: PhotoDateRange
  containerHeight?: number
  aboutTextSafelyParsedHtml?: string
  aboutTextHasBrParagraphBreaks?: boolean
}) {
  const {
    cameras,
    lenses,
    tags,
    films,
    recipes,
    focalLengths,
  } = categories;

  const categoriesCount = getCategoriesWithItemsCount(
    CATEGORY_VISIBILITY,
    categories,
  );

  const aboutRef = useRef<HTMLParagraphElement>(null);
  const aboutHeight = useElementHeight(aboutRef);
  const height = containerHeight
    ? containerHeight - (aboutHeight ? aboutHeight + ABOUT_HEIGHT_OFFSET : 0)
    : undefined;

  const maxItemsPerCategory = height
    ? Math.max(
      Math.floor(height / categoriesCount / APPROXIMATE_ITEM_HEIGHT),
      // Always show at least 2 items
      2,
    )
    : undefined;

  const { start, end } = dateRangeForPhotos(undefined, photosDateRange);

  const { photosCountHidden } = useAppState();

  const tagsIncludingHidden = useMemo(() =>
    addHiddenToTags(tags, photosCountHidden)
  , [tags, photosCountHidden]);

  const camerasContent = cameras.length > 0
    ? <HeaderList
      key="cameras"
      title="Cameras"
      icon={<IconCamera
        size={15}
        className="translate-x-[0.5px]"
      />}
      maxItems={maxItemsPerCategory}
      items={cameras
        .map(({ cameraKey, camera, count }) =>
          <PhotoCamera
            key={cameraKey}
            camera={camera}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            hideAppleIcon
            badged
          />)}
    />
    : null;

  const lensesContent = lenses.length > 0
    ? <HeaderList
      key="lenses"
      title="Lenses"
      icon={<IconLens size={15} />}
      maxItems={maxItemsPerCategory}
      items={lenses
        .map(({ lensKey, lens, count }) =>
          <PhotoLens
            key={lensKey}
            lens={lens}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const tagsContent = tags.length > 0
    ? <HeaderList
      key="tags"
      title='Tags'
      icon={<IconTag
        size={14}
        className="translate-x-[1px] translate-y-[1px]"
      />}
      maxItems={maxItemsPerCategory}
      items={tagsIncludingHidden
        .map(({ tag, count }) => {
          switch (tag) {
          case TAG_FAVS:
            return <FavsTag
              key={TAG_FAVS}
              countOnHover={count}
              type="icon-last"
              prefetch={false}
              contrast="low"
              badged
            />;
          case TAG_HIDDEN:
            return <HiddenTag
              key={TAG_HIDDEN}
              countOnHover={count}
              type="icon-last"
              prefetch={false}
              contrast="low"
              badged
            />;
          default:
            return <PhotoTag
              key={tag}
              tag={tag}
              type="text-only"
              countOnHover={count}
              prefetch={false}
              contrast="low"
              badged
            />;
          }
        })}
    />
    : null;

  const recipesContent = recipes.length > 0
    ? <HeaderList
      key="recipes"
      title="Recipes"
      icon={<IconRecipe
        size={16}
        className="translate-x-[-1px]"
      />}
      maxItems={maxItemsPerCategory}
      items={recipes
        .map(({ recipe, count }) =>
          <PhotoRecipe
            key={recipe}
            recipe={recipe}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const filmsContent = films.length > 0
    ? <HeaderList
      key="films"
      title="Films"
      icon={<IconFilm size={15} />}
      maxItems={maxItemsPerCategory}
      items={films
        .map(({ film, count }) =>
          <PhotoFilm
            key={film}
            film={film}
            countOnHover={count}
            type="text-only"
            prefetch={false}
          />)}
    />
    : null;

  const focalLengthsContent = focalLengths.length > 0
    ? <HeaderList
      key="focal-lengths"
      title="Focal Lengths"
      icon={<IconFocalLength size={13} />}
      maxItems={maxItemsPerCategory}
      items={focalLengths.map(({ focal, count }) =>
        <PhotoFocalLength
          key={focal}
          focal={focal}
          countOnHover={count}
          type="text-only"
          prefetch={false}
          badged
        />)}
    />
    : null;

  const photoStatsContent = photosCount > 0
    ? start
      ? <HeaderList
        key="photo-stats"
        title={photoQuantityText(photosCount, false)}
        items={start === end
          ? [start]
          : [`${end} –`, start]}
      />
      : <HeaderList
        key="photo-stats"
        items={[photoQuantityText(photosCount, false)]}
      />
    : null;

  return (
    <div className="space-y-4">
      {aboutTextSafelyParsedHtml && <HeaderList
        items={[<p
          key="about"
          ref={aboutRef}
          className={clsx(
            'max-w-60 normal-case text-dim',
            aboutTextHasBrParagraphBreaks && 'pb-2',
          )}
          dangerouslySetInnerHTML={{
            __html: aboutTextSafelyParsedHtml,
          }}
        />]}
      />}
      {CATEGORY_VISIBILITY.map(category => {
        switch (category) {
        case 'cameras': return camerasContent;
        case 'lenses': return lensesContent;
        case 'tags': return tagsContent;
        case 'recipes': return recipesContent;
        case 'films': return filmsContent;
        case 'focal-lengths': return focalLengthsContent;
        }
      })}
      {photoStatsContent}
    </div>
  );
}
