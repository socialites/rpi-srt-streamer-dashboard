import classNames from 'classnames';

export function Button({ children, onClick, className }: { children: preact.JSX.Element | string, onClick: () => void, className?: string }) {
  return <button class={classNames('text-white p-3 rounded-md', className)} onClick={onClick}>{children}</button>;
}