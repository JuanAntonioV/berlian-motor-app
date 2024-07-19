type Props = {
  title: string;
  description?: string;
};

export default function PageTitle({ title, description }: Props) {
  return (
    <header className='space-y-1 mb-8'>
      <h1 className='text-2xl font-bold text-neutral-900'>{title}</h1>
      {description && <p className='text-sm text-gray-500'>{description}</p>}
    </header>
  );
}
