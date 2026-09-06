'use client';

import { motion, type Variants } from 'framer-motion';
import type { Product } from '@/types/product';

import { ProductCard } from '@/components/products/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  className?: string;
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function ProductGrid({
  products,
  emptyMessage = 'No products found.',
  className
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        eyebrow="Nothing here yet"
        title="No finds in this section."
        description={emptyMessage}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        'grid min-w-0 grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.08
      }}
      transition={{
        staggerChildren: 0.06
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={cardVariants}
          className="min-w-0"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
