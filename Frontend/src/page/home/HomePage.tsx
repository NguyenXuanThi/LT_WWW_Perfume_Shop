import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import HeroBanner from "../../components/home/HeroBanner";
import BrandStrip from "../../components/home/BrandStrip";
import ProductShelf from "../../components/home/ProductShelf";
import type { ProductCardProps } from "../../components/product/ProductCard";

const newArrivals: ProductCardProps[] = [
  {
    name: "JEAN PAUL GAULTIER SCANDAL BY NIGHT EAU DE PARFUM",
    brand: "Jean Paul Gaultier",
    price: 3690000,
    volume: "75ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    badge: "NEW",
  },
  {
    name: "VALENTINO DONNA BORN IN ROMA",
    brand: "Valentino",
    price: 3150000,
    volume: "50ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    badge: "NEW",
  },
  {
    name: "GUCCI BLOOM EAU DE PARFUM",
    brand: "Gucci",
    price: 2950000,
    volume: "50ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
  },
];

const bestSellers: ProductCardProps[] = [
  {
    name: "CAROLINA HERRERA GOOD GIRL",
    brand: "Carolina Herrera",
    price: 2890000,
    volume: "80ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    badge: "BEST",
  },
  {
    name: "LANCOME LA VIE EST BELLE",
    brand: "Lancôme",
    price: 2790000,
    volume: "75ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
    badge: "HOT",
  },
  {
    name: "DIOR SAUVAGE EAU DE PARFUM",
    brand: "Dior",
    price: 3250000,
    volume: "60ml",
    imageUrl:
      "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
  },
];

const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{ minWidth: "100vw" }}
    >
      <Header />

      <main className="mx-auto max-w-6xl px-4">
        <HeroBanner />
        <BrandStrip />

        <ProductShelf
          title="New Arrivals"
          label="New Arrivals"
          subtitle="Những mùi hương vừa cập bến cửa hàng."
          products={newArrivals}
        />

        <ProductShelf
          title="Bestsellers"
          label="Bestsellers"
          subtitle="Top nước hoa được yêu thích nhất."
          products={bestSellers}
        />

        {/* Sau này bạn có thể thêm tiếp:
          - Mini & Travel Size
          - Giftset
          - Bodycare & Homecare
          - TV / Magazine (card hình ngang)
        */}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
