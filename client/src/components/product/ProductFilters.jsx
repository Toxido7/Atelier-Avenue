import Input from '../common/Input'
import Select from '../common/Select'

function ProductFilters({
  search,
  selectedCategory,
  selectedPrice,
  sortBy,
  categories,
  onSearchChange,
  onCategoryChange,
  onPriceChange,
  onSortChange,
}) {
  return (
    <div className="grid gap-4 rounded-[32px] border border-line/80 bg-white/95 px-5 py-5 shadow-soft backdrop-blur sm:px-6 lg:grid-cols-[1.3fr,0.9fr,0.8fr,0.9fr] lg:items-end">
      <Input
        label="Search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search dresses, shirts, outerwear..."
      />
      <Select
        label="Category"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select
        label="Price"
        value={selectedPrice}
        onChange={(event) => onPriceChange(event.target.value)}
      >
        <option value="all">All prices</option>
        <option value="0-100">Under $100</option>
        <option value="100-150">$100 - $150</option>
        <option value="150-200">$150 - $200</option>
        <option value="200+">$200+</option>
      </Select>
      <Select label="Sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
        <option value="price_asc">Price: Low to high</option>
        <option value="price_desc">Price: High to low</option>
      </Select>
    </div>
  )
}

export default ProductFilters
