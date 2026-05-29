import { ChangePasswordForm } from '@/components/page-components/ChangePasswordForm'

export default async function ChangePassword({
	searchParams
}: {
	searchParams: Promise<{ from?: string; token?: string }>
}) {
	const { from, token } = await searchParams
	return <ChangePasswordForm fromProfile={from === 'profile'} resetToken={token} />
}
