import getServerSideProps from '@/actions/get-store';
import ProductList from '@/components/product-list';
import Container from '@/components/ui/container';
import React from 'react'

const ProductsPage = async () => {
  const Store = await getServerSideProps()
  const { products } = Store.StoreDoc
  
  return (
    <Container>
      <div className="space-y-10 pb-10 pt-5">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="All Products" items={products} />
        </div>
      </div>
      </Container>
  )
}

export default ProductsPage