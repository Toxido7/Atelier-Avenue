import Skeleton from '../common/Skeleton'

function ProductGridSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-5">
          <Skeleton className="aspect-[4/5] w-full rounded-[28px]" />
          <div className="space-y-3 px-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGridSkeleton
