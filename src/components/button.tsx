import classNames from 'classnames';

export function Button({ children, onClick, className, disabled }: { children: (preact.JSX.Element | Element | string) | (preact.JSX.Element | Element | string)[], onClick: () => void, className?: string, disabled?: boolean }) {
  return <button class={classNames('text-white p-3 rounded-md', className)} onClick={onClick} disabled={disabled}>{children}</button>;
}