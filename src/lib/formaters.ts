export const formatRupiah = (angka: number) => {
  if (angka) {
    return new Intl.NumberFormat('id', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  } else {
    return 0;
  }
};

export function formatInputRupiah(angka: number, prefix?: string) {
  if (angka) {
    const number_string = angka
      .toString()
      .replace(/[^,\d]/g, '')
      .toString();
    const split = number_string.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : '';
  } else {
    return '0';
  }
}

export const parseRupiah = (stringNumber: string) => {
  if (stringNumber) {
    const number = stringNumber.split('.').join('');
    return Number(number);
  } else {
    return 0;
  }
};

export const formatNumber = (angka: number) => {
  if (angka) {
    const reverse = angka.toString().split('').reverse().join('');
    const ribuan = reverse.match(/\d{1,3}/g);
    const number = ribuan?.join(',').split('').reverse().join('');

    return number;
  } else {
    return 0;
  }
};

export const formatTotalSales = (total: number) => {
  if (total) {
    // make the result is like 4K+ or 1M+ or 1B+ if the total is more than 1000
    if (total >= 1000 && total < 1000000) {
      return `${(total / 1000).toFixed(1)}K+`;
    }

    if (total >= 1000000 && total < 1000000000) {
      return `${(total / 1000000).toFixed(1)}M+`;
    }

    if (total >= 1000000000) {
      return `${(total / 1000000000).toFixed(1)}B+`;
    }

    return total;
  } else {
    return 0;
  }
};
