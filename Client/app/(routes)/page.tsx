import Billboard from '@/components/ui/billboard'
import Container from '@/components/ui/container'
import getBillboard from "@/actions/get-billboard";
import ProductList from '@/components/product-list';
import getProducts from '@/actions/get-products';
import { Separator } from '@/components/ui/separator';
import getServerSideProps from '@/actions/get-store';

export default async function Home(props: any) {
  // const billboard = await getBillboard("65272c25c1b0c97f763dd290");
  // const billboardDoc = billboard.BillboardDoc
  // const products1 = await getProducts({ isFeatured: true });
  // const productsDoc = products1.ProductDoc
    const Store = await getServerSideProps();
    const { products, activeBillboard } = Store.StoreDoc;
  return (
    <>
      <div className=''>
        <Billboard data={activeBillboard} />
        {/* <Separator className='bg-black' /> */}
      </div>
      <Container>
        <div className="space-y-10 pb-10 pt-5">

          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <ProductList title="Featured Products" items={products} />
          </div>
        </div>
      </Container>
    </>
  )
}
