import Image from 'next/image'

interface IFirstSideComponentProps {
	text: string | React.ReactNode
}

export function FirstSideComponent({ text }: IFirstSideComponentProps) {
	return (
		<div className="w-[50%] bg-[url('/images/Registration-img.png')] bg-cover bg-center flex flex-col justify-between p-8">
			<p className='text-[2.75rem] max-w-sm font-nunito wrap-break-word text-[#333333] font-bold leading-[1.3]'>
				{text}
			</p>

			<Image
				src='/images/Registration-logo.svg'
				alt='Project Cards Logo'
				width={150}
				height={113}
			/>
		</div>
	)
}
