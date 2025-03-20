import { absolutePathForLens } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import { Lens } from '.';
import { shareTextForLens } from './meta';
import LensOGTile from './LensOGTile';

export default function LensShareModal({
  lens,
  photos,
  count,
  dateRange,
}: {
  lens: Lens
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForLens(lens)}
      socialText={shareTextForLens(lens, photos)}
    >
      <LensOGTile {...{ lens, photos, count, dateRange }} />
    </ShareModal>
  );
};
