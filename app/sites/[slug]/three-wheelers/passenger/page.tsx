import { redirect } from 'next/navigation'

export default async function PassengerThreeWheelersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/sites/${slug}/three-wheelers/new?category=passenger`)
}
