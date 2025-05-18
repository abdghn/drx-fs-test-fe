// app/products/page.tsx (Next.js App Router)

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'

export default function ProductPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
    axios
      .get('/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Produk</h1>

        <Link href="/products/create">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          + Tambah Produk
        </button>
        </Link>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Nama Produk</th>
              <th className="text-left px-4 py-2">Harga</th>
              <th className="text-left px-4 py-2">Diskon</th>
              <th className="text-left px-4 py-2">Harga Akhir</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.description}</td>
                <td className="px-4 py-2">Rp {p.originalPrice.toLocaleString()}</td>
                <td className="px-4 py-2">Rp {p.finalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
