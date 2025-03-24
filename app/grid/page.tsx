import {
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getDataForCategories } from '@/category/data';
import { getPhotos, getPhotosMeta } from '@/photo/db/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';

export const dynamic = 'force-static';

const getPhotosCached = cache(() => getPhotos({
  limit: INFINITE_SCROLL_GRID_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
  const [
    photos,
    photosCount,
    cameras,
    lenses,
    tags,
    recipes,
    simulations,
    focalLengths,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    ...getDataForCategories(),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridPage
        {...{
          photos,
          photosCount,
          cameras,
          lenses,
          tags,
          simulations,
          recipes,
          focalLengths,
        }}
      />
      : <PhotosEmptyState />
  );
}
