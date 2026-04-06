'use client'

import { motion, useAnimate } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext } from 'react'

type TAuthTransitionCtx = { navigateOut: (href: string) => void }

export const AuthTransitionCtx = createContext<TAuthTransitionCtx>({
	navigateOut: () => {}
})

export function useAuthTransition() {
	return useContext(AuthTransitionCtx)
}

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const router = useRouter()
	const [scope, animate] = useAnimate()

	const navigateOut = async (href: string) => {
		await animate(
			scope.current,
			{ opacity: 0, filter: 'blur(8px)', scale: 0.97 },
			{ duration: 0.2, ease: 'easeIn' }
		)
		router.push(href)
	}

	return (
		<AuthTransitionCtx.Provider value={{ navigateOut }}>
			<div ref={scope}>
				<motion.div
					key={pathname}
					initial={{ opacity: 0, filter: 'blur(4px)', y: '-40px' }}
					animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
					transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
					className='w-full h-full min-h-screen'
				>
					{children}
				</motion.div>
			</div>
		</AuthTransitionCtx.Provider>
	)
}
