import AlreadyExistPage from '@/components/page-components/AlreadyExistPage'

export default async function AlreadyExist({
	searchParams
}: {
	searchParams: Promise<{ token?: string }>
}) {
	const { token } = await searchParams
	return <AlreadyExistPage token={token} />
}
