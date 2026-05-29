import { EmailConfirmationPage } from '@/components/page-components/EmailConfirmationPage'

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ token?: string }>
}) {
	const { token } = await searchParams
	return <EmailConfirmationPage token={token} />
}
