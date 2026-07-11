import { Layers } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface DeckMiniProps {
	id: string
	title: string
	cardCount: number
}

const DeckMini = ({ id, title, cardCount }: DeckMiniProps) => {
	const t = useTranslations('modules')
	return (
		<Link
			className='w-full md:w-100 flex flex-row gap-3 p-4 rounded-lg hover:shadow-md hover:bg-gray-100 transition cursor-pointer'
			href={`/flash-card?id=${id}`}
		>
			<Layers size={32} className='mb-2 text-gray-500 shrink-0' />
			<div className='min-w-0 flex-1'>
				<p className='text-sm font-bold text-gray-700 truncate'>{title}</p>
				<p className='text-sm font-bold text-gray-500'>{cardCount} {t('cards')}</p>
			</div>
		</Link>
	)
}

export default DeckMini
