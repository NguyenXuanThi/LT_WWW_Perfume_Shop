import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard, { type ProductCardProps } from "../product/ProductCard";

type ProductShelfProps = {
  title: string;
  subtitle?: string;
  label?: string;
  products: ProductCardProps[];
  seeAllLink?: string; // <-- link tới category (vd: /nuoc-hoa-nam)
};

const ProductShelf = ({
  title,
  subtitle,
  label,
  products,
  seeAllLink,
}: ProductShelfProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = 280;
    container.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8">
      {/* Header của section */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          {label && (
            <span className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {label}
            </span>
          )}
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 hover:text-red-600"
          >
            Xem tất cả →
          </Link>
        )}
      </div>

      {/* Dãy sản phẩm scroll ngang */}
      <div className="relative">
        {/* nút trái */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-1 shadow md:inline-flex"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => {
            const card = <ProductCard {...p} />;

            // Nếu có id thì wrap bằng Link tới /product/:id
            return p.id ? (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="w-40 flex-shrink-0 sm:w-48 md:w-52"
              >
                {card}
              </Link>
            ) : (
              <div key={p.name} className="w-40 flex-shrink-0 sm:w-48 md:w-52">
                {card}
              </div>
            );
          })}
        </div>

        {/* nút phải */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-1 shadow md:inline-flex"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default ProductShelf;
