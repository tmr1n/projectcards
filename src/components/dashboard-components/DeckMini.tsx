import { Layers } from 'lucide-react'

const DeckMini = () => {
	return (
		<div className='md:w-100 flex flex-row gap-3 p-4 rounded-lg  hover:shadow-md hover:bg-gray-100  transition cursor-pointer'>
			<Layers size={32} className='mb-2 text-gray-500' />

			<div>
				<p className='text-sm font-bold text-gray-700'>
					Verben mit präpositionen
				</p>
				<p className='text-sm font-bold text-gray-500'>28 Карточек</p>
			</div>
		</div>
	)
}

export default DeckMini
