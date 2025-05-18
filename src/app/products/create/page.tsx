'use client';

import { useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function AddProductForm() {
  type Tier = {
  min: number;
  max: number;
  value: number;
};

type Discount = {
  type: "fixed" | "percentage" | "conditional" | "tiered" | "cap";
  value?: number;
  condition?: number;
  maxDiscount?: number;
  tiers?: Tier[];
};

   const router = useRouter()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const addDiscount = () => {
    setDiscounts([...discounts, { type: "fixed", value: 0 }]);
  };

  // const updateDiscount = (index: number, field: string, value: string | number) => {
  //   const newDiscounts = [...discounts];
  //   newDiscounts[index][field] = value;
  //   setDiscounts(newDiscounts);
  // };

  const updateDiscount = (
  index: number,
  field: keyof Discount,
  value: string | number
) => {
  const newDiscounts = [...discounts];
  newDiscounts[index] = {
    ...newDiscounts[index],
    [field]: value,
  };
  setDiscounts(newDiscounts);
};

  // const updateTier = (discountIndex: number, tierIndex: string | number, field: string, value: number) => {
  //   const newDiscounts = [...discounts];
  //   newDiscounts[discountIndex].tiers[tierIndex][field] = value;
  //   setDiscounts(newDiscounts);
  // };

  const updateTier = (
  discountIndex: number,
  tierIndex: number,
  field: keyof Tier,
  value: number
) => {
  const newDiscounts = [...discounts];
  if (!newDiscounts[discountIndex].tiers) return; // safety check
  const newTiers = [...newDiscounts[discountIndex].tiers];
  newTiers[tierIndex] = {
    ...newTiers[tierIndex],
    [field]: value,
  };
  newDiscounts[discountIndex] = {
    ...newDiscounts[discountIndex],
    tiers: newTiers,
  };
  setDiscounts(newDiscounts);
};

  const addTier = (index: number) => {
    const newDiscounts = [...discounts];
    if (!newDiscounts[index].tiers) newDiscounts[index].tiers = [];
    newDiscounts[index].tiers.push({ min: 0, max: 0, value: 0 });
    setDiscounts(newDiscounts);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      originalPrice: Number(originalPrice),
      discounts,
    };

      axios.post('/api/products', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => router.push('/'))
      .catch((error) => console.error('Error fetching data:', error));
    console.log("Submit payload:", JSON.stringify(payload, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold">Tambah Produk</h2>

      <input
        className="border rounded w-full p-2"
        type="text"
        placeholder="Nama Produk"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="border rounded w-full p-2"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border rounded w-full p-2"
        type="number"
        placeholder="Harga Asli"
        value={originalPrice}
        onChange={(e) => setOriginalPrice(Number(e.target.value))}
      />

      <div className="space-y-2">
        <h3 className="font-semibold">Diskon</h3>
        {discounts.map((d, i) => (
          <div key={i} className="border p-2 rounded space-y-2">
            <select
              className="w-full border rounded p-2"
              value={d.type}
              onChange={(e) => updateDiscount(i, "type", e.target.value)}
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
              <option value="conditional">Conditional</option>
              <option value="tiered">Tiered</option>
              <option value="cap">Cap</option>
            </select>

            {d.type === "fixed" || d.type === "percentage" ? (
              <input
                type="number"
                className="w-full border rounded p-2"
                placeholder="Value"
                value={d.value || 0}
                onChange={(e) => updateDiscount(i, "value", Number(e.target.value))}
              />
            ) : d.type === "conditional" ? (
              <div className="space-y-1">
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  placeholder="Condition"
                  value={d.condition || 0}
                  onChange={(e) => updateDiscount(i, "condition", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  placeholder="Value"
                  value={d.value || 0}
                  onChange={(e) => updateDiscount(i, "value", Number(e.target.value))}
                />
              </div>
            ) : d.type === "tiered" ? (
              <div className="space-y-2">
                {d.tiers?.map((tier: { min: string | number | readonly string[] | undefined; max: string | number | readonly string[] | undefined; value: string | number | readonly string[] | undefined; }, j: number ) => (
                  <div key={j} className="flex gap-2">
                    <input
                      type="number"
                      className="border p-2 w-1/3"
                      placeholder="Min"
                      value={tier.min}
                      onChange={(e) => updateTier(i, j, "min", Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="border p-2 w-1/3"
                      placeholder="Max"
                      value={tier.max}
                      onChange={(e) => updateTier(i, j, "max", Number(e.target.value))}
                    />
                    <input
                      type="number"
                      className="border p-2 w-1/3"
                      placeholder="Value"
                      value={tier.value}
                      onChange={(e) => updateTier(i, j, "value", Number(e.target.value))}
                    />
                  </div>
                ))}

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" onClick={() => addTier(i)}>
                  + Tambah Tier
              </button>
              </div>
            ) : d.type === "cap" ? (
              <input
                type="number"
                className="w-full border rounded p-2"
                placeholder="Max Discount"
                value={d.maxDiscount || 0}
                onChange={(e) => updateDiscount(i, "maxDiscount", Number(e.target.value))}
              />
            ) : null}
          </div>
        ))}

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" onClick={addDiscount}>
            + Tambah Diskon
        </button>
      </div>
      
        <button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>
            Simpan Produk
        </button>

    </form>
  );
}
