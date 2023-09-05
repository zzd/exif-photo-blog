import { Photo } from '.';
import ImageSmall from '@/components/ImageSmall';
import Link from 'next/link';
import { cc } from '@/utility/css';
import { routeForPhoto } from '@/site/routes';

export default function PhotoSmall({
  photo,
  selected,
}: {
  photo: Photo
  selected?: boolean
}) {
  return (
    <Link
      href={routeForPhoto(photo)}
      className={cc(
        'active:brightness-75',
        selected && 'brightness-50',
      )}
    >
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        className="w-full"
        alt={photo.title ?? 'Photo'}
      />
    </Link>
  );
};