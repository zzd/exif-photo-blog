'use client';

import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoRecipe from './PhotoRecipe';
import { useAppState } from '@/state/AppState';
import { descriptionForRecipePhotos, getRecipePropsFromPhotos } from '.';

export default function RecipeHeader({
  recipe,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  recipe: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const { recipeModalProps, setRecipeModalProps } = useAppState();

  const recipeProps = getRecipePropsFromPhotos(photos, selectedPhoto);

  return (
    <PhotoHeader
      recipe={recipe}
      entity={<PhotoRecipe
        recipe={recipe}
        contrast="high"
        isShowingRecipeOverlay={Boolean(recipeModalProps)}
        toggleRecipeOverlay={recipeProps
          ? () => setRecipeModalProps?.(recipeProps)
          : undefined}
      />}
      entityDescription={descriptionForRecipePhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
