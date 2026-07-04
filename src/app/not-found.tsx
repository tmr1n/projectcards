import Link from 'next/link'

export default function RootNotFound() {
	return (
		<div className='min-h-screen bg-white flex flex-col items-center justify-center px-6'>
			<p className='text-8xl font-bold text-gray-100 select-none leading-none'>404</p>
			<h1 className='mt-4 text-2xl font-bold text-gray-900'>Page not found</h1>
			<p className='mt-2 text-gray-500'>Sorry, we couldn't find the page you're looking for.</p>
			<Link
				href='/'
				className='mt-8 px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-colors'
			>
				Go home
			</Link>
		</div>
	)
}
