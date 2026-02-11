import Image from 'next/image'
import Link from 'next/link'
import { ButtonMain } from '../buttons/ButtonMain'

export function Header() {
	return (
		<header className='flex items-center justify-between px-2 py-2'>
			<Link href='/' className='flex items-center gap-2'>
				<Image
					src='/images/Logo.svg'
					alt='Project Cards Logo'
					width={113}
					height={76}
				/>
			</Link>
			<ButtonMain text={'Вход'}></ButtonMain>
		</header>
	)
}
