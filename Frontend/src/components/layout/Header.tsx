const Header = () => {
  return (
    <header className="w-full">
      {/* Thanh thông báo đỏ trên cùng */}
      <div className="bg-red-600 text-[11px] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-1">
          <span>Freeship toàn quốc cho đơn từ 1.000.000₫</span>
          <span>Hotline: 1900 123 456</span>
        </div>
      </div>

      {/* Thanh menu chính */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              PF
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-900">
                PERFUME
              </span>
              <span className="text-[11px] text-slate-500">Boutique</span>
            </div>
          </div>

          {/* Ô tìm kiếm */}
          <div className="hidden flex-1 items-center md:flex">
            <div className="flex w-full max-w-md items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <input
                type="text"
                placeholder="Tìm kiếm nước hoa, thương hiệu..."
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Icon tài khoản + giỏ */}
          <div className="flex items-center gap-3 text-xs">
            <button className="hidden text-slate-700 hover:text-red-600 sm:inline-flex">
              Đăng nhập
            </button>
            <button className="relative flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              <span>Giỏ hàng</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Menu dưới (category) */}
        <nav className="mx-auto hidden max-w-6xl items-center gap-6 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 md:flex">
          <button className="text-red-600">Trang chủ</button>
          <button className="hover:text-red-600">Nước hoa nữ</button>
          <button className="hover:text-red-600">Nước hoa nam</button>
          <button className="hover:text-red-600">Mini & Travel Size</button>
          <button className="hover:text-red-600">Giftset</button>
          <button className="hover:text-red-600">Bodycare</button>
          <button className="hover:text-red-600">Thương hiệu</button>
          <button className="hover:text-red-600">Khuyến mãi</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
