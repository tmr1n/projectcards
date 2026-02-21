interface Props {
	text: string
}

export function ButtonMain({ text }: Props) {
	return (
		<div className='flex justify-center'>
			<button className='cursor-pointer bg-[#4255ff] text-white text-[1rem] px-4 py-2 m-2 rounded-3xl font-semibold hover:bg-[#7342bc] duration-300 ease'>
				{text}
			</button>
		</div>
	)
}
