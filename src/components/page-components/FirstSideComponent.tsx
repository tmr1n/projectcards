import Image from 'next/image'
import type { IFirstSideComponentProps } from '@/shared/types/layout.types'

export function FirstSideComponent({ text }: IFirstSideComponentProps) {
	return (
		<div className="hidden md:w-[50%] md:bg-[url('/images/Registration-img.png')] md:bg-cover md:bg-center md:flex md:flex-col md:justify-between md:p-8">
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
