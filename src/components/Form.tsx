import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({ children, className, ...props }: Props) {
  return (
    <form {...props}>
      <div className={cn('grid w-full items-center gap-5', className)}>
        {children}
      </div>
    </form>
  );
}
