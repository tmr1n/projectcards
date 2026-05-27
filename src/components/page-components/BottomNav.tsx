'use client'

import { Folder, House, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const popups: Record<number, { Icon: typeof Plus; label: string }> = {
	1: { Icon: Plus, label: 'Добавить модуль' },
	2: { Icon: Folder, label: 'Мои модули' },
}

export default function BottomNav() {
	const [active, setActive] = useState(0)
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const [displayIndex, setDisplayIndex] = useState<number>(1)
	const router = useRouter()

	const handleNavClick = (i: number) => {
		if (i === 0) {
			setActive(0)
			setOpenIndex(null)
			router.push('/dashboard')
		} else if (openIndex === i) {
			setOpenIndex(null)
		} else {
			setDisplayIndex(i)
			setOpenIndex(i)
		}
	}

	const popup = popups[displayIndex]

	return (
		<>
			{openIndex !== null && (
				<div className='fixed inset-0 z-40' onClick={() => setOpenIndex(null)} />
			)}

			<div className='relative z-50'>
				{/* Centered popup above the panel */}
				<div
					className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-200 ease-out ${
						openIndex !== null
							? 'opacity-100 translate-y-0 pointer-events-auto'
							: 'opacity-0 translate-y-6 pointer-events-none'
					}`}
				>
					<button
						onClick={() => setOpenIndex(null)}
						className='flex items-center gap-3 whitespace-nowrap rounded-2xl bg-blue-600 px-5 py-3.5 text-white font-medium text-sm shadow-lg transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800'
					>
						<span className='bg-white/20 rounded-full p-1.5'>
							<popup.Icon size={16} color='white' />
						</span>
						{popup.label}
					</button>
				</div>

				{/* Nav bar */}
				<div className='bg-blue-600 rounded-4xl m-5 w-80 h-18.75 flex items-center justify-between'>
					{[House, Plus, Folder].map((Icon, i) => (
						<div
							key={i}
							onClick={() => handleNavClick(i)}
							className={`rounded-full w-15 h-15 m-2 flex items-center justify-center cursor-pointer transition-colors duration-200 ${
								(i === 0 ? active === 0 : openIndex === i) ? 'bg-blue-900' : 'bg-blue-600'
							}`}
						>
							<Icon size={40} color='white' />
						</div>
					))}
				</div>
			</div>
		</>
	)
}
