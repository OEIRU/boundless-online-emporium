
import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Women', path: '/category/women' },
  { id: 2, name: 'Men', path: '/category/men' },
  { id: 3, name: 'Kids', path: '/category/kids' },
  { id: 4, name: 'Home', path: '/category/home' },
  { id: 5, name: 'Electronics', path: '/category/electronics' },
  { id: 6, name: 'Beauty', path: '/category/beauty' },
  { id: 7, name: 'Sports', path: '/category/sports' },
  { id: 8, name: 'Shoes', path: '/category/shoes' }
];

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="bg-store-gray py-2 border-b overflow-x-auto hide-scrollbar sticky top-[62px] z-40">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-5 md:space-x-8 whitespace-nowrap">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={category.path}
                className={`inline-block py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'text-store-purple border-b-2 border-store-purple'
                    : 'text-gray-600 hover:text-store-purple'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryNav;
