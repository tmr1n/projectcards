'use client'

import { Folder, House, Plus } from 'lucide-react'
import { useState } from 'react'

const navItems = [
	{ icon: House },
	{ icon: Plus },
	{ icon: Folder },
]

export default function BottomNav() {
	const [active, setActive] = useState(0)

	return (
		<div className='bg-blue-600 rounded-4xl m-5 w-80 h-18.75 flex items-center justify-between'>
			{navItems.map(({ icon: Icon }, i) => (
				<div
					key={i}
					onClick={() => setActive(i)}
					className={`rounded-full w-15 h-15 m-2 flex items-center justify-center cursor-pointer transition-colors ${
						active === i ? 'bg-blue-900' : 'bg-blue-600'
					}`}
				>
					<Icon size={40} color='white' />
				</div>
			))}
		</div>
	)
}
