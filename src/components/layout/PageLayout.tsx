
import { ReactNode } from 'react';
import Navbar from './Navbar';
import CategoryNav from './CategoryNav';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  showCategories?: boolean;
}

const PageLayout = ({ children, showCategories = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showCategories && <CategoryNav />}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
