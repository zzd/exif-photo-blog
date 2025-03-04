'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
  titleForPhoto,
} from '.';
import SiteGrid from '@/components/SiteGrid';
import ImageLarge from '@/components/image/ImageLarge';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { pathForFocalLength, pathForPhoto } from '@/app/paths';
import PhotoTags from '@/tag/PhotoTags';
import ShareButton from '@/share/ShareButton';
import DownloadButton from '@/components/DownloadButton';
import PhotoCamera from '../camera/PhotoCamera';
import { cameraFromPhoto } from '@/camera';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import { sortTags } from '@/tag';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoLink from './PhotoLink';
import {
  SHOULD_PREFETCH_ALL_LINKS,
  ALLOW_PUBLIC_DOWNLOADS,
  SHOW_TAKEN_AT_TIME,
  SHOW_RECIPES,
} from '@/app/config';
import AdminPhotoMenuClient from '@/admin/AdminPhotoMenuClient';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { useMemo, useRef } from 'react';
import useVisible from '@/utility/useVisible';
import PhotoDate from './PhotoDate';
import { useAppState } from '@/state/AppState';
import { LuExpand } from 'react-icons/lu';
import LoaderButton from '@/components/primitives/LoaderButton';
import Tooltip from '@/components/Tooltip';
import ZoomControls, { ZoomControlsRef } from '@/components/image/ZoomControls';
import { TbChecklist } from 'react-icons/tb';
import { IoCloseSharp } from 'react-icons/io5';
import { AnimatePresence } from 'framer-motion';
import useRecipeState from '../recipe/useRecipeState';
import PhotoRecipeOverlay from '@/recipe/PhotoRecipeGrid';
import PhotoRecipe from '@/recipe/PhotoRecipe';

export default function PhotoLarge({
  photo,
  className,
  primaryTag,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  prefetchRelatedLinks = SHOULD_PREFETCH_ALL_LINKS,
  revalidatePhoto,
  showTitle = true,
  showTitleAsH1,
  showCamera = true,
  showSimulation = true,
  showRecipe = true,
  showZoomControls: showZoomControlsProp = true,
  shouldZoomOnFKeydown = true,
  shouldShare = true,
  shouldShareTag,
  shouldShareCamera,
  shouldShareSimulation,
  shouldShareRecipe,
  shouldShareFocalLength,
  includeFavoriteInAdminMenu,
  onVisible,
}: {
  photo: Photo
  className?: string
  primaryTag?: string
  priority?: boolean
  prefetch?: boolean
  prefetchRelatedLinks?: boolean
  revalidatePhoto?: RevalidatePhoto
  showTitle?: boolean
  showTitleAsH1?: boolean
  showCamera?: boolean
  showSimulation?: boolean
  showRecipe?: boolean
  showZoomControls?: boolean
  shouldZoomOnFKeydown?: boolean
  shouldShare?: boolean
  shouldShareTag?: boolean
  shouldShareCamera?: boolean
  shouldShareSimulation?: boolean
  shouldShareRecipe?: boolean
  shouldShareFocalLength?: boolean
  includeFavoriteInAdminMenu?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  const zoomControlsRef = useRef<ZoomControlsRef>(null);

  const {
    areZoomControlsShown,
    arePhotosMatted,
    shouldDebugRecipeOverlays,
    isUserSignedIn,
  } = useAppState();

  const showZoomControls = showZoomControlsProp && areZoomControlsShown;

  const refRecipe = useRef<HTMLDivElement>(null);
  const refRecipeButton = useRef<HTMLButtonElement>(null);
  const refTriggers = useMemo(() => [refRecipeButton], []);
  const {
    shouldShowRecipe,
    toggleRecipe,
    hideRecipe,
  } = useRecipeState({
    ref: refRecipe,
    refTriggers,
  });

  const tags = sortTags(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);
  
  const { recipeTitle: recipe } = photo;

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showRecipeContent = showRecipe && recipe;
  const showTagsContent = tags.length > 0;
  const showExifContent = shouldShowExifDataForPhoto(photo);

  useVisible({ ref, onVisible });

  const hasTitle =
    showTitle &&
    Boolean(photo.title);

  const hasTitleContent =
    hasTitle ||
    Boolean(photo.caption);

  const hasMetaContent =
    showCameraContent ||
    showTagsContent ||
    showRecipeContent ||
    showExifContent;

  const hasNonDateContent =
    hasTitleContent ||
    hasMetaContent;

  const renderPhotoLink = () =>
    <PhotoLink
      photo={photo}
      className="font-bold uppercase grow"
      prefetch={prefetch}
    />;

  const matteContentWidthForAspectRatio = () => {
    // Restrict width for landscape photos
    // (portrait photos are always height restricted)
    if (photo.aspectRatio > 3 / 2 + 0.1) {
      return 'w-[90%]';
    } else if (photo.aspectRatio >= 1) {
      return 'w-[80%]';
    }
  };

  const largePhotoContent =
    <div className={clsx(
      'relative',
      arePhotosMatted && 'flex items-center justify-center',
      // Always specify height to ensure fallback doesn't collapse
      arePhotosMatted && 'h-[90%]',
      arePhotosMatted && matteContentWidthForAspectRatio(),
    )}>
      <ZoomControls
        ref={zoomControlsRef}
        {...{ isEnabled: showZoomControls, shouldZoomOnFKeydown }}
      >
        <ImageLarge
          className={clsx(arePhotosMatted && 'h-full')}
          imgClassName={clsx(arePhotosMatted &&
            'object-contain w-full h-full')}
          alt={altTextForPhoto(photo)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurDataURL={photo.blurData}
          blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
          priority={priority}
        />
      </ZoomControls>
      <div className={clsx(
        'absolute inset-0',
        'flex items-center justify-center',
      )}>
        <AnimatePresence>
          {(shouldShowRecipe || shouldDebugRecipeOverlays) &&
          photo.recipeData &&
          photo.filmSimulation &&
            <PhotoRecipeOverlay
              ref={refRecipe}
              recipe={photo.recipeData}
              simulation={photo.filmSimulation}
              iso={photo.isoFormatted}
              exposure={photo.exposureCompensationFormatted}
              onClose={hideRecipe}
            />}
        </AnimatePresence>
      </div>
    </div>;

  const largePhotoContainerClassName = clsx(arePhotosMatted &&
    'flex items-center justify-center aspect-3/2 bg-gray-100',
  );

  return (
    <SiteGrid
      containerRef={ref}
      className={className}
      contentMain={showZoomControls
        ? <div className={largePhotoContainerClassName}>
          {largePhotoContent}
        </div>
        : <Link
          href={pathForPhoto({ photo })}
          className={largePhotoContainerClassName}
          prefetch={prefetch}
        >
          {largePhotoContent}
        </Link>}
      contentSide={
        <DivDebugBaselineGrid className={clsx(
          'relative',
          'sticky top-4 self-start -translate-y-1',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-x-0.5 sm:gap-x-1 gap-y-baseline',
          'pb-6',
        )}>
          {/* Meta */}
          <div className="pr-2 md:pr-0">
            <div className="md:relative flex gap-2 items-start">
              {hasTitle && (showTitleAsH1
                ? <h1>{renderPhotoLink()}</h1>
                : renderPhotoLink())}
              <div className="absolute right-0 translate-y-[-4px] z-10">
                <AdminPhotoMenuClient {...{
                  photo,
                  revalidatePhoto,
                  includeFavorite: includeFavoriteInAdminMenu,
                  ariaLabel: `Admin menu for '${titleForPhoto(photo)}' photo`,
                }} />
              </div>
            </div>
            <div className="space-y-baseline">
              {photo.caption &&
                <div className={clsx(
                  'uppercase', 
                  // Prevent collision with admin button
                  isUserSignedIn && 'md:pr-7',
                )}>
                  {photo.caption}
                </div>}
              {(showCameraContent || showRecipeContent || showTagsContent) &&
                <div>
                  {showCameraContent &&
                    <PhotoCamera
                      camera={camera}
                      contrast="medium"
                      prefetch={prefetchRelatedLinks}
                    />}
                  {showRecipeContent &&
                    <PhotoRecipe
                      recipe={recipe}
                      contrast="medium"
                      prefetch={prefetchRelatedLinks}
                    />}
                  {showTagsContent &&
                    <PhotoTags
                      tags={tags}
                      contrast="medium"
                      prefetch={prefetchRelatedLinks}
                    />}
                </div>}
            </div>
          </div>
          {/* EXIF Data */}
          <div className={clsx(
            'space-y-baseline',
            !hasTitleContent && !hasMetaContent && 'md:-mt-baseline',
          )}>
            {showExifContent &&
              <>
                <ul className="text-medium">
                  <li>
                    {photo.focalLength &&
                      <Link
                        href={pathForFocalLength(photo.focalLength)}
                        className="hover:text-main active:text-medium"
                      >
                        {photo.focalLengthFormatted}
                      </Link>}
                    {(
                      photo.focalLengthIn35MmFormatFormatted &&
                      // eslint-disable-next-line max-len
                      photo.focalLengthIn35MmFormatFormatted !== photo.focalLengthFormatted
                    ) &&
                      <>
                        {' '}
                        <Tooltip content="35mm equivalent" sideOffset={3}>
                          <span
                            className={clsx(
                              'text-extra-dim',
                              'decoration-dotted underline-offset-[3px]',
                              'hover:underline',
                            )}
                          >
                            {photo.focalLengthIn35MmFormatFormatted}
                          </span>
                        </Tooltip>
                      </>}
                  </li>
                  <li>{photo.fNumberFormatted}</li>
                  <li>{photo.exposureTimeFormatted}</li>
                  <li>{photo.isoFormatted}</li>
                  <li>{photo.exposureCompensationFormatted ?? '0ev'}</li>
                </ul>
                {(
                  (showSimulation && photo.filmSimulation) ||
                  (SHOW_RECIPES && showRecipe && photo.recipeData)
                ) &&
                  <div className="flex items-center gap-2 *:w-auto">
                    {showSimulation && photo.filmSimulation &&
                      <PhotoFilmSimulation
                        simulation={photo.filmSimulation}
                        prefetch={prefetchRelatedLinks}
                      />}
                    {SHOW_RECIPES && photo.recipeData &&
                      <button
                        ref={refRecipeButton}
                        title="Fujifilm Recipe"
                        onClick={toggleRecipe}
                        className={clsx(
                          'text-medium',
                          'border-medium rounded-md',
                          'px-[4px] py-[2.5px] my-[-2.5px]',
                          'hover:bg-dim active:bg-main',
                        )}>
                        {shouldShowRecipe
                          ? <IoCloseSharp size={15} />
                          : <TbChecklist
                            className="translate-x-[0.5px]"
                            size={15}
                          />}
                      </button>} 
                  </div>}
              </>}
            <div className={clsx(
              'flex gap-x-3 gap-y-baseline',
              'md:flex-col flex-wrap',
              'md:justify-normal',
            )}>
              <PhotoDate
                photo={photo}
                className={clsx(
                  'text-medium',
                  // Prevent collision with admin button
                  !hasNonDateContent && isUserSignedIn && 'md:pr-7',
                )}
                // 'createdAt' is a naive datetime which does not require
                // a timezone and will not cause server/client mismatch
                timezone={null}
                hideTime={!SHOW_TAKEN_AT_TIME}
              />
              <div className={clsx(
                'flex gap-1 translate-y-[0.5px]',
                'translate-x-[-2.5px]',
              )}>
                {showZoomControls &&
                  <LoaderButton
                    title="Open Image Viewer"
                    icon={<LuExpand size={15} />}
                    onClick={() => zoomControlsRef.current?.open()}
                    styleAs="link"
                    className="text-medium translate-y-[0.25px]"
                    hideFocusOutline
                  />}
                {shouldShare &&
                  <ShareButton
                    title="Share Photo"
                    photo={photo}
                    tag={shouldShareTag ? primaryTag : undefined}
                    camera={shouldShareCamera ? camera : undefined}
                    simulation={shouldShareSimulation
                      ? photo.filmSimulation
                      : undefined}
                    recipe={shouldShareRecipe
                      ? recipe
                      : undefined}
                    focal={shouldShareFocalLength
                      ? photo.focalLength
                      : undefined}
                    prefetch={prefetchRelatedLinks}
                  />}
                {ALLOW_PUBLIC_DOWNLOADS && 
                  <DownloadButton 
                    className="translate-y-[0.5px] md:translate-y-0"
                    photo={photo} 
                  />}
              </div>
            </div>
          </div>
        </DivDebugBaselineGrid>}
    />
  );
};
