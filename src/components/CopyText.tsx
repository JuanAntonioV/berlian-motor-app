'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';

type Props = {
  value?: string;
  iconPosition?: 'start' | 'end';
  className?: string;
} & React.HTMLProps<HTMLParagraphElement>;

export default function CopyText({
  value,
  iconPosition = 'end',
  className = '',
  ...props
}: Props) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      setCopySuccess(true);
      toast.success('Berhasil menyalin');
    } catch (err) {
      setCopySuccess(false);
      toast.error('Gagal menyalin');
    }
  };

  return (
    <p
      className={`flex items-center w-fit gap-2 cursor-pointer ${className}`}
      onClick={copyToClipboard}
      {...props}
    >
      {iconPosition === 'start' && (
        <>
          {copySuccess ? (
            <FaCircleCheck size={16} color='#10B981' />
          ) : (
            <FaRegCopy size={14} color='#6B7280' />
          )}
        </>
      )}
      {value}{' '}
      {iconPosition === 'end' && (
        <>
          {copySuccess ? (
            <FaCircleCheck size={16} color='#10B981' />
          ) : (
            <FaRegCopy size={14} color='#6B7280' />
          )}
        </>
      )}
    </p>
  );
}
