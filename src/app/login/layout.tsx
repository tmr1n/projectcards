// app/(auth)/layout.tsx — ПРАВИЛЬНО
import { AnimatedPage } from '@/components/page-components/AnimatedPage'

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AnimatedPage>{children}</AnimatedPage>
}
