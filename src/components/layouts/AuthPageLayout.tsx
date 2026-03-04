'use client'

import { FirstSideComponent } from '@/components/page-components/FirstSideComponent'
import type { IAuthPageLayoutProps } from '@/shared/types/form.types'

export function AuthPageLayout({
	sideText,
	topButtons,
	navigationTabs,
	children
}: IAuthPageLayoutProps) {
	return (
		<div className='flex flex-row h-screen'>
			<FirstSideComponent text={sideText} />
			<div className='w-full md:w-[50%] overflow-y-auto flex flex-col'>
				{topButtons && <div className='p-4'>{topButtons}</div>}

				{navigationTabs && (
					<div className='flex flex-row gap-8 justify-center max-w-lg w-full mx-auto'>
						{navigationTabs}
					</div>
				)}

				{children}
			</div>
		</div>
	)
}
