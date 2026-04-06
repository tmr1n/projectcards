import { FeaturedDecks } from '@/components/landing/FeaturedDecks'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'

export default function Home() {
	return (
		<>
			<HeroSection />
			<div id='popular-decks' className='scroll-mt-24'>
				<FeaturedDecks />
			</div>
			<div id='how-it-works' className='scroll-mt-24'>
				<HowItWorks />
			</div>
			<Footer />
		</>
	)
}
