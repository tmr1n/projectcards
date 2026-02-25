import Image from 'next/image'
import Link from 'next/link'
import { ButtonMain } from '../buttons/ButtonMain'

export function Header() {
	return (
		<header className='flex px-2 py-2 items-center justify-between'>
			<div className='flex justify-start'>
				<Link href='/' className='gap-2 '>
					<Image
						src='/images/Logo.svg'
						alt='Project Cards Logo'
						width={113}
						height={76}
					/>
				</Link>
			</div>

			<div className='justify-end'>
				<ButtonMain text={'Вход'} href='/login'></ButtonMain>
			</div>
		</header>
	)
}

//залупа, переделатть
