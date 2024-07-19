import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Center({ className = '', children, ...props }: Props) {
  return (
    <div className={cn('flexCenterCol gap-2 h-screen', className)} {...props}>
      {children}
    </div>
  );
}
