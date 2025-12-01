const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Perfume Boutique. All rights reserved.
        </p>
        <div className="flex gap-4">
          <button className="hover:text-brand">Điều khoản</button>
          <button className="hover:text-brand">Chính sách bảo mật</button>
          <button className="hover:text-brand">Hỗ trợ</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
