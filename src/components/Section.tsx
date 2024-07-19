import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Section({ children, className, ...props }: Props) {
  return (
    <section
      className={cn(
        'bg-white px-4 py-4 lg:px-8 lg:py-6 rounded shadow-md h-fit',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
