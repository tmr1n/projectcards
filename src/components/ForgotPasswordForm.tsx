import { FirstSideComponent } from '@/components/FirstSideComponent'

interface Props {}

export default function ForgotPasswordForm({}: Props) {
	return (
		<div className='flex flex-row h-screen'>
			<FirstSideComponent text='У вас всё получится!' />
		</div>
	)
}
