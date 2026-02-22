interface ILineComponentProps {
	text: string
}

export function LineComponent({ text }: ILineComponentProps) {
	return (
		<div className='flex items-center pt-4'>
			<span className='flex-1 h-[1.5px] bg-[#eaeaea] mx-2.5'></span>
			<span className='font-nunito text-sm font-semibold text-[#586380] '>
				{text}
			</span>
			<span className='flex-1 h-[1.5px] bg-[#eaeaea] mx-2.5'></span>
		</div>
	)
}
