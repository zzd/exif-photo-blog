import PhotoOGImageResponse from '@/photo/image-response/PhotoOGImageResponse';
import { getPhoto } from '@/services/postgres';
import { IMAGE_OG_WIDTH, IMAGE_OG_HEIGHT } from '@/site';
import { FONT_FAMILY_IBM_PLEX_MONO, getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

const DEBUG_CACHING: boolean = false;

export const runtime = 'edge';

export async function GET(request: Request, context: any) {
  const photo = await getPhoto(context.params.photoId);
  const fontData = await getIBMPlexMonoMedium();
  return new ImageResponse(
    (
      <PhotoOGImageResponse
        photo={photo}
        requestOrPhotoPath={request}
        width={IMAGE_OG_WIDTH}
        height={IMAGE_OG_HEIGHT}
        fontFamily={FONT_FAMILY_IBM_PLEX_MONO}
      />
    ),
    {
      width: IMAGE_OG_WIDTH,
      height: IMAGE_OG_HEIGHT,
      fonts: [
        {
          name: FONT_FAMILY_IBM_PLEX_MONO,
          data: fontData,
          weight: 500,
          style: 'normal',
        },
      ],
      ...!DEBUG_CACHING && {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
      },
    },
  );
}