import { redirect } from 'next/navigation'

export default async function CargoThreeWheelersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/sites/${slug}/three-wheelers/new?category=cargo`)
}
