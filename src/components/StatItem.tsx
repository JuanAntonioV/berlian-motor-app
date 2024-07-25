'use client';

import { formatNumber, formatRupiah } from '@/lib/formaters';
import { TStatItem } from '@/types';
import { FaUserFriends, FaUsers } from 'react-icons/fa';
import { IoMdCart } from 'react-icons/io';
import { IoWallet, IoWatch } from 'react-icons/io5';

type Props = {
  item: TStatItem;
};

export default function StatItem({ item }: Props) {
  const icons: { [key: string]: React.ReactNode } = {
    'total-revenue': <IoWallet size={32} />,
    'total-revenue-today': <IoMdCart size={32} />,
    'total-orders': <FaUsers size={32} />,
    'total-order-products': <IoWatch size={32} />,
    'total-users': <FaUserFriends size={32} />,
    'total-admin': <FaUserFriends size={32} />,
    'total-cashier': <FaUserFriends size={32} />,
    'total-active': <FaUserFriends size={32} />,
    'total-non-active': <FaUserFriends size={32} />,
  };

  const colors: { [key: string]: string } = {
    'total-revenue': 'bg-orange-600 text-white',
    'total-orders': 'bg-blue-600 text-white',
    'total-order-products': 'bg-teal-600 text-white',
    'total-users': 'bg-cyan-600 text-white',
    'total-revenue-today': 'bg-cyan-600 text-white',
    'total-admin': 'bg-indigo-600 text-white',
    'total-cashier': 'bg-indigo-600 text-white',
    'total-active': 'bg-indigo-600 text-white',
    'total-non-active': 'bg-indigo-600 text-white',
  };

  const color = colors[item.id];
  const icon = icons[item.id];

  const isCurrency = item.type === 'currency';
  const isNumber = item.type === 'number';
  const isDate = item.type === 'date';

  return (
    <div className='p-4 bg-white border rounded-lg shadow'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-600'>{item.name}</p>
          <p className='text-2xl font-semibold text-gray-800'>
            {isCurrency
              ? formatRupiah(Number(item.value))
              : isNumber
              ? formatNumber(Number(item.value))
              : isDate
              ? item.value
              : item.value}
          </p>

          <p className='text-sm font-medium text-gray-600'>
            {item.description}
          </p>
        </div>
        {icon && (
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg shadow-lg ${color}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
