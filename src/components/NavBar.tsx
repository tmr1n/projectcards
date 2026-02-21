interface INavBarProps {
	text: string
}

export function NavBar({ text }: INavBarProps) {
	return (
		<div className='pt-8'>
			<span className='text-2xl font-bold text-black font-nunito'>{text}</span>
		</div>
	)
}
