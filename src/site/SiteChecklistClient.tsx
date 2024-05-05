'use client';

import { ComponentProps, ReactNode, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx/lite';
import ChecklistRow from '../components/ChecklistRow';
import { FiExternalLink } from 'react-icons/fi';
import {
  BiCog,
  BiCopy,
  BiData,
  BiLockAlt,
  BiPencil,
  BiRefresh,
} from 'react-icons/bi';
import IconButton from '@/components/IconButton';
import InfoBlock from '@/components/InfoBlock';
import Checklist from '@/components/Checklist';
import { toastSuccess } from '@/toast';
import { ConfigChecklistStatus } from './config';
import StatusIcon from '@/components/StatusIcon';
import { labelForStorage } from '@/services/storage';
import { HiSparkles } from 'react-icons/hi';

export default function SiteChecklistClient({
  hasDatabase,
  isPostgresSSLEnabled,
  hasVercelPostgres,
  hasVercelKV,
  hasStorageProvider,
  hasVercelBlobStorage,
  hasCloudflareR2Storage,
  hasAwsS3Storage,
  hasMultipleStorageProviders,
  currentStorage,
  hasAuthSecret,
  hasAdminUser,
  hasTitle,
  hasDomain,
  showRepoLink,
  showFilmSimulations,
  showExifInfo,
  isProModeEnabled,
  isBlurEnabled,
  isGeoPrivacyEnabled,
  isPriorityOrderEnabled,
  isAiTextGenerationEnabled,
  aiTextAutoGeneratedFields,
  hasAiTextAutoGeneratedFields,
  isPublicApiEnabled,
  isOgTextBottomAligned,
  gridAspectRatio,
  hasGridAspectRatio,
  simplifiedView,
  showRefreshButton,
  secret,
}: ConfigChecklistStatus & {
  simplifiedView?: boolean
  showRefreshButton?: boolean
  secret: string
}) {
  const router = useRouter();

  const [isPendingPage, startTransitionPage] = useTransition();
  const [isPendingSecret, startTransitionSecret] = useTransition();

  const refreshPage = () => {
    startTransitionPage(router.refresh);
  };
  const refreshSecret = () => {
    startTransitionSecret(router.refresh);
  };

  const renderLink = (href: string, text: string, external = true) =>
    <>
      <a {...{
        href,
        ...external && { target: '_blank', rel: 'noopener noreferrer' },
        className: clsx(
          'underline hover:no-underline',
        ),
      }}>
        {text}
      </a>
      {external &&
        <>
          &nbsp;
          <FiExternalLink
            size={14}
            className='inline translate-y-[-1.5px]'
          />
        </>}
    </>;

  const renderCopyButton = (label: string, text: string, subtle?: boolean) =>
    <IconButton
      icon={<BiCopy size={15} />}
      className={clsx(subtle && 'text-gray-300 dark:text-gray-700')}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toastSuccess(`${label} copied to clipboard`);
      }}
    />;

  const renderEnvVar = (
    variable: string,
    minimal?: boolean,
  ) =>
    <div
      key={variable}
      className={clsx(
        'overflow-x-auto overflow-y-hidden',
        minimal && 'inline-flex',
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className={clsx(
          'text-medium',
          'rounded-sm',
          'bg-gray-100 dark:bg-gray-800',
        )}>
          `{variable}`
        </span>
        {!minimal && renderCopyButton(variable, variable, true)}
      </span>
    </div>;

  const renderEnvVars = (variables: string[]) =>
    <div className="py-1 space-y-1">
      {variables.map(envVar => renderEnvVar(envVar))}
    </div>;

  const renderSubStatus = (
    type: ComponentProps<typeof StatusIcon>['type'],
    label: ReactNode,
  ) =>
    <div className="flex gap-1 -translate-x-1">
      <StatusIcon {...{ type }} />
      <span>
        {label}
      </span>
    </div>;

  return (
    <div className="max-w-xl space-y-6 w-full">
      <Checklist
        title="Storage"
        icon={<BiData size={16} />}
      >
        <ChecklistRow
          title="Setup database"
          status={hasDatabase}
          isPending={isPendingPage}
        >
          {hasVercelPostgres
            ? renderSubStatus('checked', 'Vercel Postgres: connected')
            : renderSubStatus('optional', <>
              Vercel Postgres:
              {' '}
              {renderLink(
                // eslint-disable-next-line max-len
                'https://vercel.com/docs/storage/vercel-postgres/quickstart#create-a-postgres-database',
                'create store',
              )}
              {' '}
              and connect to project
            </>)}
          {hasDatabase && !hasVercelPostgres &&
            renderSubStatus('checked', <>
              Postgres-compatible: connected
              {' '}
              (SSL {isPostgresSSLEnabled ? 'enabled' : 'disabled'})
            </>)}
        </ChecklistRow>
        <ChecklistRow
          title={!hasStorageProvider
            ? 'Setup storage (one of the following)'
            : hasMultipleStorageProviders
              // eslint-disable-next-line max-len
              ? `Setup storage (new uploads go to: ${labelForStorage(currentStorage)})`
              : 'Setup storage'}
          status={hasStorageProvider}
          isPending={isPendingPage}
        >
          {hasVercelBlobStorage
            ? renderSubStatus('checked', 'Vercel Blob: connected')
            : renderSubStatus('optional', <>
              {labelForStorage('vercel-blob')}:
              {' '}
              {renderLink(
                // eslint-disable-next-line max-len
                'https://vercel.com/docs/storage/vercel-blob/quickstart#create-a-blob-store',
                'create store',
              )}
              {' '} 
              and connect to project
            </>
            )}
          {hasCloudflareR2Storage
            ? renderSubStatus('checked', 'Cloudflare R2: connected')
            : renderSubStatus('optional', <>
              {labelForStorage('cloudflare-r2')}:
              {' '}
              {renderLink(
                'https://github.com/sambecker/exif-photo-blog#cloudflare-r2',
                'create/configure bucket',
              )}
            </>)}
          {hasAwsS3Storage
            ? renderSubStatus('checked', 'AWS S3: connected')
            : renderSubStatus('optional', <>
              {labelForStorage('aws-s3')}:
              {' '}
              {renderLink(
                'https://github.com/sambecker/exif-photo-blog#aws-s3',
                'create/configure bucket',
              )}
            </>)}
        </ChecklistRow>
      </Checklist>
      <Checklist
        title="Authentication"
        icon={<BiLockAlt size={16} />}
      >
        <ChecklistRow
          title="Setup auth"
          status={hasAuthSecret}
          isPending={isPendingPage}
        >
          Store auth secret in environment variable:
          {!hasAuthSecret &&
            <div className="overflow-x-auto">
              <InfoBlock className="my-1.5 inline-flex" padding="tight">
                <div className="flex flex-nowrap items-center gap-4">
                  <span>{secret}</span>
                  <div className="flex items-center gap-0.5">
                    {renderCopyButton('Secret', secret)}
                    <IconButton
                      icon={<BiRefresh size={18} />}
                      onClick={refreshSecret}
                      isLoading={isPendingSecret}
                      spinnerColor="text"
                    />
                  </div>
                </div>
              </InfoBlock>
            </div>}
          {renderEnvVars(['AUTH_SECRET'])}
        </ChecklistRow>
        <ChecklistRow
          title="Setup admin user"
          status={hasAdminUser}
          isPending={isPendingPage}
        >
          Store admin email/password
          {' '}
          in environment variables:
          {renderEnvVars([
            'ADMIN_EMAIL',
            'ADMIN_PASSWORD',
          ])}
        </ChecklistRow>
      </Checklist>
      <Checklist
        title="Content"
        icon={<BiPencil size={16} />}
        optional
      >
        <ChecklistRow
          title="Add title"
          status={hasTitle}
          isPending={isPendingPage}
          optional
        >
          Store in environment variable (used in page titles):
          {renderEnvVars(['NEXT_PUBLIC_SITE_TITLE'])}
        </ChecklistRow>
        <ChecklistRow
          title="Add custom domain"
          status={hasDomain}
          isPending={isPendingPage}
          optional
        >
          Store in environment variable (displayed in top-right nav):
          {renderEnvVars(['NEXT_PUBLIC_SITE_DOMAIN'])}
        </ChecklistRow>
      </Checklist>
      {!simplifiedView && <>
        <Checklist
          title="AI Text Generation"
          icon={<HiSparkles />}
          experimental
          optional
        >
          <ChecklistRow
            title="Add OpenAI Secret Key"
            status={isAiTextGenerationEnabled}
            isPending={isPendingPage}
            optional
          >
            Store your OpenAI secret key in order to add experimental support
            for AI-generated text descriptions and enable an invisible field
            called {'"Semantic Description"'} used to support CMD-K search
            {renderEnvVars(['OPENAI_SECRET_KEY'])}
          </ChecklistRow>
          <ChecklistRow
            title="Enable Rate Limiting"
            status={hasVercelKV}
            isPending={isPendingPage}
            optional
          >
            {renderLink(
              // eslint-disable-next-line max-len
              'https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database',
              'Create Vercel KV store',
            )}
            {' '}
            and connect to project in order to enable rate limiting
          </ChecklistRow>
          <ChecklistRow
            // eslint-disable-next-line max-len
            title={`Auto-generated fields: ${aiTextAutoGeneratedFields.join(', ')}`}
            status={hasAiTextAutoGeneratedFields}
            isPending={isPendingPage}
            optional
          >
            Comma-separated fields to auto-generate when
            uploading photos. Accepted values: title, caption,
            tags, description, all, or none (default is {'"all"'}).
            {renderEnvVars(['AI_TEXT_AUTO_GENERATED_FIELDS'])}
          </ChecklistRow>
        </Checklist>
        <Checklist
          title="Settings"
          icon={<BiCog size={16} />}
          optional
        >
          <ChecklistRow
            title="Pro mode"
            status={isProModeEnabled}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to enable
            higher quality image storage:
            {renderEnvVars(['NEXT_PUBLIC_PRO_MODE'])}
          </ChecklistRow>
          <ChecklistRow
            title="Image Blur"
            status={isBlurEnabled}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to prevent
            image blur data being stored and displayed
            {renderEnvVars(['NEXT_PUBLIC_BLUR_DISABLED'])}
          </ChecklistRow>
          <ChecklistRow
            title="Geo privacy"
            status={isGeoPrivacyEnabled}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to disable
            collection/display of location-based data
            {renderEnvVars(['NEXT_PUBLIC_GEO_PRIVACY'])}
          </ChecklistRow>
          <ChecklistRow
            title="Priority order"
            status={isPriorityOrderEnabled}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to prevent
            priority order photo field affecting photo order
            {renderEnvVars(['NEXT_PUBLIC_IGNORE_PRIORITY_ORDER'])}
          </ChecklistRow>
          <ChecklistRow
            title="Public API"
            status={isPublicApiEnabled}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to enable
            a public API available at <code>/api</code>:
            {renderEnvVars(['NEXT_PUBLIC_PUBLIC_API'])}
          </ChecklistRow>
          <ChecklistRow
            title="Show repo link"
            status={showRepoLink}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to hide footer link:
            {renderEnvVars(['NEXT_PUBLIC_HIDE_REPO_LINK'])}
          </ChecklistRow>
          <ChecklistRow
            title="Show Fujifilm simulations"
            status={showFilmSimulations}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to prevent
            simulations showing up in <code>/grid</code> sidebar:
            {renderEnvVars(['NEXT_PUBLIC_HIDE_FILM_SIMULATIONS'])}
          </ChecklistRow>
          <ChecklistRow
            title="Show EXIF data"
            status={showExifInfo}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"1"'} to hide EXIF data:
            {renderEnvVars(['NEXT_PUBLIC_HIDE_EXIF_DATA'])}
          </ChecklistRow>
          <ChecklistRow
            title={`Grid aspect ratio: ${gridAspectRatio}`}
            status={hasGridAspectRatio}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to any number to enforce aspect ratio
            {' '}
            (default is {'"1"'}, i.e., square)—set to {'"0"'} to disable:
            {renderEnvVars(['NEXT_PUBLIC_GRID_ASPECT_RATIO'])}
          </ChecklistRow>
          <ChecklistRow
            title="Legacy OG text alignment"
            status={isOgTextBottomAligned}
            isPending={isPendingPage}
            optional
          >
            Set environment variable to {'"BOTTOM"'} to
            keep OG image text bottom aligned (default is {'"top"'}):
            {renderEnvVars(['NEXT_PUBLIC_OG_TEXT_ALIGNMENT'])}
          </ChecklistRow>
        </Checklist>
      </>}
      {showRefreshButton &&
        <div className="py-4 space-y-4">
          <button onClick={refreshPage}>
            Check
          </button>
        </div>}
      <div className="px-11 text-dim">
        Changes to environment variables require a redeploy
        or reboot of local dev server
      </div>
    </div>
  );
}
