import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export default function SectionHeader({
  children,
  className,
  ...props
}: Props) {
  return (
    <header className={cn('flexBetween gap-3 mb-6', className)} {...props}>
      {children}
    </header>
  );
}
