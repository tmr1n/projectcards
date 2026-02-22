'use client'

import { useRouter } from 'next/navigation'

interface Props {
	text: string
	href?: string
}

export function ButtonMain({ text, href }: Props) {
	const router = useRouter()

	const handleClick = () => {
		if (href) {
			router.push(href)
		}
	}

	return (
		<div className='flex justify-center'>
			<button
				onClick={handleClick}
				className='cursor-pointer bg-[#4255ff] text-white text-[1rem] px-4 py-2 m-2 rounded-3xl font-semibold hover:bg-[#7342bc] duration-300 ease'
			>
				{text}
			</button>
		</div>
	)
}
