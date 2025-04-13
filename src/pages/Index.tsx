
import PageLayout from '@/components/layout/PageLayout';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ProductGrid from '@/components/products/ProductGrid';

const Index = () => {
  return (
    <PageLayout>
      <HeroBanner />
      <div className="my-8">
        <FeaturedProducts />
        <ProductGrid title="Новые поступления" />
      </div>
    </PageLayout>
  );
};

export default Index;
