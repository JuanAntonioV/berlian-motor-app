type Props = {
  errors: string[] | null | undefined;
  name: string;
};
export default function FieldError({ errors, name = 'Input' }: Props) {
  if (!errors) return null;

  return (
    <div className='text-red-500 text-sm'>
      <p>{name} harus:</p>
      <ul className='list-disc list-inside'>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
