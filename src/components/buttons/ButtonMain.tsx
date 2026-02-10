interface Props {
	text: string
}

export function ButtonMain({ text }: Props) {
	return (
		<div className='flex justify-center'>
			<button className='bg-blue-700 text-white text-lg p-3 m-2 rounded-3xl font-semibold hover:bg-violet-800 duration-200 ease-in'>
				{text}
			</button>
		</div>
	)
}
