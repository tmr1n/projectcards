import { ChangePasswordForm } from '@/components/page-components/ChangePasswordForm'

export default async function ChangePassword({
	searchParams
}: {
	searchParams: Promise<{ from?: string }>
}) {
	const { from } = await searchParams
	return <ChangePasswordForm fromProfile={from === 'profile'} />
}
