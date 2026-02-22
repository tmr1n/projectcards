interface ILabelProps {
	text: string
}

export function LabelComponent({ text }: ILabelProps) {
	return (
		<div>
			<label className='block mb-2 text-sm font-semibold text-[#586380] transition-colors duration-300 ease-in-out font-nunito'>
				{text}
			</label>
		</div>
	)
}
