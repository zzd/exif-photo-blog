'use client';

import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import InfinitePhotoScroll from '../photo/InfinitePhotoScroll';
import AdminPhotosTable from './AdminPhotosTable';

export default function AdminPhotosTableInfinite({
  initialOffset,
  itemsPerPage,
  hasAiTextGeneration,
}: {
  initialOffset: number
  itemsPerPage: number
  hasAiTextGeneration?: boolean
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={`page-${PATH_ADMIN_PHOTOS}`}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      useCachedPhotos={false}
      includeHiddenPhotos
    >
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <AdminPhotosTable
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
          hasAiTextGeneration={hasAiTextGeneration}
        />}
    </InfinitePhotoScroll>
  );
}
