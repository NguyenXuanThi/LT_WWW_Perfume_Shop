// src/components/product/ProductCard.tsx

export type ProductCardProps = {
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  volume?: string;
  badge?: string; // NEW, BEST, -10%...
};

const ProductCard = ({
  name,
  brand,
  price,
  imageUrl,
  volume,
  badge,
}: ProductCardProps) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-slate-50">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain p-2 transition duration-700 group-hover:scale-105"
        />

        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
            {badge}
          </span>
        )}

        <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm hover:text-red-500">
          ♥
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 py-3 text-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {brand}
        </span>
        <h3 className="line-clamp-2 text-[13px] font-medium text-slate-900">
          {name}
        </h3>
        {volume && <p className="text-[11px] text-slate-500">{volume}</p>}

        <p className="mt-1 text-sm font-semibold text-red-600">
          {price.toLocaleString("vi-VN")}₫
        </p>

        <button className="mt-2 w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700 transition hover:border-red-500 hover:bg-red-500 hover:text-white">
          Thêm vào giỏ
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
