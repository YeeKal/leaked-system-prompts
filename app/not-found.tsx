import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-primary-accent">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          {`Sorry, we couldn't find the page you're looking for.`}
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
  )
}