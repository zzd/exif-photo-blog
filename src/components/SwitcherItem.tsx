import { clsx } from 'clsx/lite';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { ReactNode } from 'react';
import Spinner from './Spinner';
import LinkWithIconLoader from './LinkWithIconLoader';

export default function SwitcherItem({
  icon,
  title,
  href,
  className: classNameProp,
  onClick,
  active,
  isInteractive = true,
  noPadding,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
}: {
  icon: ReactNode
  title?: string
  href?: string
  className?: string
  onClick?: () => void
  active?: boolean
  isInteractive?: boolean
  noPadding?: boolean
  prefetch?: boolean
}) {
  const className = clsx(
    'flex items-center justify-center',
    'w-[42px] h-full',
    'py-0.5 px-1.5',
    isInteractive && 'cursor-pointer',
    isInteractive && 'hover:bg-gray-100/60 active:bg-gray-100',
    isInteractive && 'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
    active
      ? 'text-black dark:text-white'
      : 'text-gray-400 dark:text-gray-600',
    active
      ? 'hover:text-black dark:hover:text-white'
      : 'hover:text-gray-700 dark:hover:text-gray-400',
    classNameProp,
  );

  const renderIcon = () => noPadding
    ? icon
    : <div className={clsx(
      'w-[28px] h-[24px]',
      'flex items-center justify-center',
    )}>
      {icon}
    </div>;

  return (
    href
      ? <LinkWithIconLoader {...{
        title,
        href,
        className,
        prefetch,
        icon: renderIcon(),
        loader: <Spinner />,
      }} />
      : <div {...{ title, onClick, className }}>
        {renderIcon()}
      </div>
  );
};
