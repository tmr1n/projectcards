import Image from 'next/image'
import Link from 'next/link'
import { ButtonMain } from '../buttons/ButtonMain'
import Variants from './Header.menu'

export function Header() {
	return (
		<header className='flex px-2 py-2 items-center md:justify-between'>
			<div className='cursor-pointer md:hidden'>
				{/* <Menu color='black' size={32} /> */}
				<Variants />
			</div>
			{/* <div className='w-12 md:hidden' /> */}
			{/* //Починить */}
			<div className='hidden md:flex'>
				<Link href='/' className='gap-2 '>
					<Image
						src='/images/Logo.svg'
						alt='Project Cards Logo'
						width={113}
						height={76}
						className='cursor-pointer '
					/>
				</Link>
			</div>
			<div className='flex-1 flex justify-center mx-4 md:hidden'>
				<Link href='/' className='gap-2 '>
					<Image
						src='/images/Logo-adaptive.svg'
						alt='Project Cards Logo'
						width={50}
						height={50}
						className='cursor-pointer '
					/>
				</Link>
			</div>
			<div className=''>
				<ButtonMain text={'Вход'} href='/login'></ButtonMain>
			</div>
		</header>
	)
}

//ya tut segodnya bil
