import CommandKClient, { CommandKSection } from '@/components/CommandKClient';
import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  PATH_ADMIN_BASELINE,
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_SIGN_IN,
  pathForCamera,
  pathForFilmSimulation,
  pathForPhoto,
  pathForTag,
} from './paths';
import { formatCameraText } from '@/camera';
import { authCached } from '@/auth/cache';
import { getPhotos } from '@/services/vercel-postgres';
import { getKeywordsForPhoto, photoQuantityText, titleForPhoto } from '@/photo';
import PhotoTiny from '@/photo/PhotoTiny';
import { formatCount, formatCountDescriptive } from '@/utility/string';
import { BiLockAlt, BiSolidUser } from 'react-icons/bi';
import { sortTagsObject } from '@/tag';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { FaTag } from 'react-icons/fa';
import { TbPhoto } from 'react-icons/tb';
import { IoMdCamera } from 'react-icons/io';
import { HiDocumentText } from 'react-icons/hi';
import { signOutAction } from '@/auth/actions';
import PhotoDate from '@/photo/PhotoDate';
import { ADMIN_DEBUG_TOOLS_ENABLED } from './config';

export default async function CommandK() {
  const [
    count,
    tags,
    cameras,
    filmSimulations,
  ] = await Promise.all([
    getPhotosCountCached().catch(() => 0),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getUniqueFilmSimulationsCached().catch(() => []),
  ]);

  const session = await authCached().catch(() => null);

  const isAdminLoggedIn = Boolean(session?.user?.email);

  const SECTION_TAGS: CommandKSection = {
    heading: 'Tags',
    accessory: <FaTag
      size={10}
      className="translate-x-[1px] translate-y-[0.75px]"
    />,
    items: sortTagsObject(tags).map(({ tag, count }) => ({
      label: tag,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForTag(tag),
    })),
  };

  const SECTION_CAMERAS: CommandKSection = {
    heading: 'Cameras',
    accessory: <IoMdCamera />,
    items: cameras.map(({ camera, count }) => ({
      label: formatCameraText(camera),
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForCamera(camera),
    })),
  };

  const SECTION_FILM: CommandKSection = {
    heading: 'Film Simulations',
    accessory: <span className="w-3">
      <PhotoFilmSimulationIcon className="translate-y-[0.5px]" />
    </span>,
    items: filmSimulations.map(({ simulation, count }) => ({
      label: simulation,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
      path: pathForFilmSimulation(simulation),
    })),
  };

  const SECTION_PAGES: CommandKSection = {
    heading: 'Pages',
    accessory: <HiDocumentText size={15} className="translate-x-[-1px]" />,
    items: ([{
      label: 'Home',
      path: '/',
    }, {
      label: 'Grid',
      path:'/grid',
    }]),
  };

  const SECTION_ADMIN: CommandKSection = {
    heading: 'Admin',
    accessory: <BiSolidUser size={15} className="translate-x-[-1px]" />,
    items: isAdminLoggedIn
      ? [{
        label: 'Manage Photos',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_PHOTOS,
      }, {
        label: 'Manage Uploads',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_UPLOADS,
      }, {
        label: 'Manage Tags',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_TAGS,
      }, {
        label: 'App Config',
        annotation: <BiLockAlt />,
        path: PATH_ADMIN_CONFIGURATION,
      }, {
        label: 'Sign Out',
        action: signOutAction,
      }]
      : [{
        label: 'Sign In',
        path: PATH_SIGN_IN,
      }],
  };

  if (isAdminLoggedIn && ADMIN_DEBUG_TOOLS_ENABLED) {
    SECTION_ADMIN.items.push({
      label: 'Baseline Overview',
      path: PATH_ADMIN_BASELINE,
    });
  }

  return <CommandKClient
    serverSections={[
      SECTION_TAGS,
      SECTION_CAMERAS,
      SECTION_FILM,
      SECTION_PAGES,
      SECTION_ADMIN,
    ]}
    onQueryChange={async (query) => {
      'use server';
      const photos = (await getPhotos({ query, limit: 10 }));
      return photos.length > 0
        ? [{
          heading: 'Photos',
          accessory: <TbPhoto size={14} />,
          items: photos.map(photo => ({
            label: titleForPhoto(photo),
            keywords: getKeywordsForPhoto(photo),
            annotation: <PhotoDate {...{ photo }} />,
            accessory: <PhotoTiny photo={photo} />,
            path: pathForPhoto(photo),
          })),
        }]
        : [];
    }}
    showDebugTools={isAdminLoggedIn && ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
