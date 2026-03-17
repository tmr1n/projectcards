import { BookOpen, GraduationCap, Layers } from 'lucide-react'

const stats = [
	{ label: 'Колод создано', value: '0', icon: Layers },
	{ label: 'Карточек всего', value: '0', icon: BookOpen },
	{ label: 'Дней подряд', value: '0', icon: GraduationCap }
]

export default function ProfilePage() {
	return (
		<div className='p-6 space-y-6'>
			{/* Аватар и имя */}
			<div className='flex items-center gap-4'>
				<div className='size-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground'>
					U
				</div>
				<div>
					<h1 className='text-xl font-semibold'>Username</h1>
					<p className='text-sm text-muted-foreground'>user@example.com</p>
				</div>
			</div>

			{/* Статистика */}
			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				{stats.map(({ label, value, icon: Icon }) => (
					<div
						key={label}
						className='rounded-xl border bg-card p-4 flex items-center gap-3'
					>
						<div className='size-10 rounded-lg bg-muted flex items-center justify-center'>
							<Icon className='size-5 text-muted-foreground' />
						</div>
						<div>
							<p className='text-2xl font-bold'>{value}</p>
							<p className='text-xs text-muted-foreground'>{label}</p>
						</div>
					</div>
				))}
			</div>

			{/* Последняя активность */}
			<div className='rounded-xl border bg-card p-4'>
				<h2 className='text-sm font-medium mb-3 text-black'>
					Последняя активность
				</h2>
				<p className='text-sm text-muted-foreground'>Пока нет активности.</p>
			</div>
		</div>
	)
}
