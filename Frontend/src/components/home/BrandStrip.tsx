const brands = [
  "GUCCI",
  "DIOR",
  "YSL",
  "CHANEL",
  "GIVENCHY",
  "ARMANI",
  "PRADA",
  "VALENTINO",
  "LANCOME",
  "HERMÈS",
  "BURBERRY",
  "CHLOÉ",
];

const BrandStrip = () => {
  return (
    <section className="py-10">
      <div className="grid gap-6 md:grid-cols-[1.4fr,1.1fr] md:items-stretch">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <img
            src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg"
            alt="Giorgio Armani"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid h-full grid-cols-3 gap-4 bg-white px-4 py-6 text-xs text-slate-700 shadow-sm sm:grid-cols-4">
          {brands.map((b) => (
            <div
              key={b}
              className="flex items-center justify-center rounded border border-slate-100 bg-slate-50 px-2 py-3 text-center font-semibold tracking-wide hover:border-slate-300"
            >
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;
