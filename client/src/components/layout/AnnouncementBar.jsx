import Container from './Container'

function AnnouncementBar() {
  return (
    <div className="border-b border-black/5 bg-ink py-3 text-white">
      <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs font-medium uppercase tracking-[0.28em] sm:flex-row sm:text-left">
        <span>Complimentary shipping on orders over $200</span>
        <span>Portfolio-ready premium ecommerce foundation</span>
      </Container>
    </div>
  )
}

export default AnnouncementBar
