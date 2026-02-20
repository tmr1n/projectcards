interface ICheckbox {
	text: string
}

export function Checkbox({ text }: ICheckbox) {
	return (
		<div className='flex items-center mb-5 mt-5  '>
			<label
				htmlFor=''
				className='flex flex-start select-none ms-2 text-sm font-medium text-heading'
			>
				<input
					type='checkbox'
					className='w-4 relative h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft'
					// checked={formData.mailing_enabled}
					// onChange={e => handleInputChange('mailing_enabled', e.target.checked)}
				/>
				<span className='text-gray-800 font-nunito ml-2 font-semibold '>
					{text}
				</span>
			</label>
		</div>
	)
}
