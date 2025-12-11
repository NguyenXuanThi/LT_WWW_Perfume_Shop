import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="mt-4 overflow-hidden rounded-3xl bg-slate-900">
      <div className="relative h-[220px] sm:h-[280px] lg:h-[340px]">
        <img
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg"
          alt="Jean Paul Gaultier Scandal"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

        <div className="relative flex h-full flex-col justify-center gap-4 px-6 text-white sm:px-10 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-red-200">
            Exclusive Launch
          </p>
          <h1 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
            Jean Paul Gaultier
            <br />
            <span className="text-4xl sm:text-5xl">SCANDAL</span>
          </h1>
          <p className="max-w-sm text-xs text-slate-100">
            Hương thơm ngọt ngào, quyến rũ với nốt mật ong, hoa nhài và hoắc
            hương – dành cho những buổi tối khó quên.
          </p>
          <Link
            to="/nuoc-hoa/tat-ca"
            className="mt-1 w-fit rounded-full bg-red-600 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:bg-red-700"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
