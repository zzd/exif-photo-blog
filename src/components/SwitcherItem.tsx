import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';

export default function SwitcherItem({
  icon,
  title,
  href,
  className: classNameProp,
  onClick,
  active,
  noPadding,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
}: {
  icon: JSX.Element
  title?: string
  href?: string
  className?: string
  onClick?: () => void
  active?: boolean
  noPadding?: boolean
  prefetch?: boolean
}) {
  const className = clsx(
    classNameProp,
    'py-0.5 px-1.5',
    'cursor-pointer',
    'hover:bg-gray-100/60 active:bg-gray-100',
    'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
    active
      ? 'text-black dark:text-white'
      : 'text-gray-400 dark:text-gray-600',
    active
      ? 'hover:text-black hover:dark:text-white'
      : 'hover:text-gray-700 dark:hover:text-gray-400',
  );

  const renderIcon = () => noPadding
    ? icon
    : <div className="w-[28px] h-[24px] flex items-center justify-center">
      {icon}
    </div>;

  return (
    href
      ? <Link {...{ title, href, className, prefetch }}>
        {renderIcon()}
      </Link>
      : <div {...{ title, onClick, className }}>{renderIcon()}</div>
  );
};
