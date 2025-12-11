import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function CartIcon() {
    const navigate = useNavigate();
    const { items, totalItems, removeFromCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const getFinalPrice = (item: typeof items[0]) => {
        return item.price * (1 - item.discountPercent / 100);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Icon giỏ hàng */}
            <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center p-2 hover:text-red-600 transition-colors"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
            {totalItems}
          </span>
                )}
            </button>

            {/* Modal hover */}
            {isHovered && items.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-xl z-50">
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">
                            Giỏ hàng ({totalItems} sản phẩm)
                        </h3>

                        <div className="max-h-64 overflow-y-auto space-y-3">
                            {items.slice(0, 5).map((item) => (
                                <div key={item.id} className="flex gap-3 items-start">
                                    <img
                                        src={`/images/${item.image}`}
                                        alt={item.name}
                                        className="h-16 w-16 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-900 truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-slate-500">{item.brand}</p>
                                        <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-red-600">
                        {getFinalPrice(item).toLocaleString("vi-VN")}₫
                      </span>
                                            <span className="text-xs text-slate-500">
                        x{item.quantity}
                      </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromCart(item.id);
                                        }}
                                        className="text-slate-400 hover:text-red-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {items.length > 5 && (
                                <p className="text-xs text-slate-500 text-center pt-2">
                                    Và {items.length - 5} sản phẩm khác...
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate("/cart")}
                            className="mt-4 w-full rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                            Xem giỏ hàng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}