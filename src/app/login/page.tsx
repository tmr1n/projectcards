import Image from 'next/image'

//import { useForm } from 'react-hook-form'
interface Props {}

export default function Login({}: Props) {
	//const { register, handleSubmit } = useForm()
	return (
		<div className='flex flex-row h-screen'>
			<div className="w-[50%] bg-[url('/images/Registration-img.png')] bg-cover bg-center ">
				<p className='text-[2.75rem] m-15  max-w-100 font-nunito wrap-break-word text-[#333333] font-bold hyphens-auto leading-[1.3] '>
					Щелкайте <br /> модули как орешки.
				</p>

				<Image
					className='m-15 mt-80'
					src='/images/Registration-logo.svg'
					alt='Project Cards Logo'
					width={150}
					height={113}
				/>
			</div>
			<div className='w-[50%] bg-white'>
				<form action=''></form>
			</div>
		</div>
	)
}
