import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'

type Param = string | string[] | undefined

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: Param }>
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const sort = parse(resolvedParams.sort)
  const category = parse(resolvedParams.category)
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? 'Browse high-quality assets'}
        query={{
          category,
          limit: 40,
          sort: sort === 'desc' || sort === 'asc' ? sort : undefined,
        }}
      ></ProductReel>
    </MaxWidthWrapper>
  )
}
