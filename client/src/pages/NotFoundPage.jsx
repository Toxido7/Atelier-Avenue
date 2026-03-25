import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Container from '../components/layout/Container'

function NotFoundPage() {
  return (
    <section className="section-shell">
      <Container>
        <EmptyState
          title="Page not found"
          description="The page you requested does not exist in this frontend template."
          actionLabel="Back to home"
          action={() => {
            window.location.href = '/'
          }}
        />
        <div className="mt-6 text-center">
          <Link to="/shop">
            <Button variant="ghost">Browse shop</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default NotFoundPage
