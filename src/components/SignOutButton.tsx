import { logoutAction } from '@/actions/authAction';
import { MdLogout } from 'react-icons/md';

type Props = {
  className?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function SignOutButton({ className, ...props }: Props) {
  return (
    <form action={logoutAction}>
      <button
        className='text-destructive gap-x-3 p-1 rounded-lg w-full flex items-center'
        type='submit'
      >
        <MdLogout size={18} />
        Keluar
      </button>
    </form>
  );
}
