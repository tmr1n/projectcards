import Link from 'next/link'

export default async function DatenschutzPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params

	return (
		<div className='mx-auto max-w-2xl px-6 py-12 leading-relaxed text-gray-700'>
			<h1 className='mb-2 text-3xl font-semibold text-gray-900'>
				Datenschutzerklärung
			</h1>
			<p className='mb-8 text-sm text-amber-600'>
				Vereinfachte Fassung für ein privates, nicht-kommerzielles Lernprojekt.
			</p>

			<h2 className='mt-8 mb-2 text-xl font-semibold text-gray-900'>
				1. Datenschutz auf einen Blick
			</h2>
			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Allgemeine Hinweise</h3>
			<p>
				Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
				Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
				Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
				identifiziert werden können.
			</p>
			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				Datenerfassung auf dieser Website
			</h3>
			<p className='mb-2'>
				<strong>Wer ist verantwortlich für die Datenerfassung?</strong> Die
				Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
				Dessen Kontaktdaten finden Sie im Abschnitt „Hinweis zur verantwortlichen
				Stelle“.
			</p>
			<p className='mb-2'>
				<strong>Wie erfassen wir Ihre Daten?</strong> Ihre Daten werden zum einen
				dadurch erhoben, dass Sie uns diese mitteilen (z. B. bei der Registrierung
				oder beim Login). Andere Daten werden automatisch beim Besuch der Website
				durch unsere IT-Systeme erfasst (v. a. technische Daten wie Browser,
				Betriebssystem oder Uhrzeit des Seitenaufrufs).
			</p>
			<p>
				<strong>Wofür nutzen wir Ihre Daten?</strong> Ein Teil der Daten wird
				erhoben, um eine fehlerfreie Bereitstellung der Website und der App
				(Lernkarten) zu gewährleisten sowie zum Betrieb Ihres Nutzerkontos.
			</p>
			<p className='mt-2'>
				<strong>Welche Rechte haben Sie?</strong> Sie haben jederzeit das Recht,
				unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
				gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein
				Recht auf Berichtigung oder Löschung dieser Daten sowie ein
				Beschwerderecht bei der zuständigen Aufsichtsbehörde.
			</p>

			<h2 className='mt-8 mb-2 text-xl font-semibold text-gray-900'>2. Hosting</h2>
			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Externes Hosting</h3>
			<p>
				Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf
				dieser Website erfasst werden, werden auf den Servern des Hosters
				gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktdaten,
				Namen, Websitezugriffe und sonstige über eine Website generierte Daten
				handeln. Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung
				gegenüber unseren Nutzern (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse
				einer sicheren und effizienten Bereitstellung unseres Online-Angebots
				(Art. 6 Abs. 1 lit. f DSGVO). Der Serverstandort befindet sich in der EU
				(Amsterdam, Niederlande). Wir setzen folgenden Hoster ein:
			</p>
			<p className='my-2'>
				Railway Corp
				<br />
				548 Market St PMB 68956
				<br />
				San Francisco, CA 94104, USA
			</p>

			<h2 className='mt-8 mb-2 text-xl font-semibold text-gray-900'>
				3. Allgemeine Hinweise und Pflichtinformationen
			</h2>
			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				Hinweis zur verantwortlichen Stelle
			</h3>
			<p>
				Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website
				ist:
			</p>
			<p className='my-2'>
				[Vorname Nachname]
				<br />
				[Straße und Hausnummer]
				<br />
				[PLZ] Hamburg
				<br />
				E-Mail: [deine-email@example.com]
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Speicherdauer</h3>
			<p>
				Soweit innerhalb dieser Datenschutzerklärung keine speziellere
				Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei
				uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein
				berechtigtes Löschersuchen geltend machen oder eine Einwilligung
				widerrufen, werden Ihre Daten gelöscht, sofern keine anderen rechtlich
				zulässigen Gründe für die Speicherung bestehen.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Ihre Rechte</h3>
			<p>
				Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das
				Recht auf unentgeltliche Auskunft über Ihre gespeicherten
				personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der
				Datenverarbeitung sowie ein Recht auf Berichtigung, Löschung,
				Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
				(Art. 21 DSGVO). Des Weiteren steht Ihnen ein Beschwerderecht bei der
				zuständigen Datenschutz-Aufsichtsbehörde zu. Eine erteilte Einwilligung
				können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				SSL- bzw. TLS-Verschlüsselung
			</h3>
			<p>
				Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
				vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine
				verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
				Browsers von „http://“ auf „https://“ wechselt.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				Widerspruch gegen Werbe-E-Mails
			</h3>
			<p>
				Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
				Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung
				und Informationsmaterialien wird hiermit widersprochen.
			</p>

			<h2 className='mt-8 mb-2 text-xl font-semibold text-gray-900'>
				4. Datenerfassung auf dieser Website
			</h2>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Cookies</h3>
			<p>
				Diese Website verwendet ausschließlich technisch notwendige Cookies für
				Login und Sitzung (Session-Cookies und ein httpOnly-Cookie für die
				Anmeldung). Es findet kein Tracking und keine Analyse statt. Diese Cookies
				sind erforderlich, damit bestimmte Funktionen (insbesondere die Anmeldung)
				funktionieren, und werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
				gespeichert (berechtigtes Interesse an einer technisch fehlerfreien
				Bereitstellung).
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Server-Log-Dateien</h3>
			<p>
				Der Provider der Seiten erhebt und speichert automatisch Informationen in
				Server-Log-Dateien, die Ihr Browser automatisch übermittelt: Browsertyp
				und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des
				zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine
				Zusammenführung dieser Daten mit anderen Datenquellen erfolgt nicht.
				Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				Registrierung auf dieser Website
			</h3>
			<p>
				Sie können sich auf dieser Website registrieren, um ein Nutzerkonto
				anzulegen und die Funktionen der App (Lernkarten) zu nutzen. Bei der
				Registrierung erheben wir Ihre E-Mail-Adresse, einen Benutzernamen und ein
				Passwort. Das Passwort wird ausschließlich als kryptografischer Hash
				gespeichert, niemals im Klartext. Die Verarbeitung erfolgt zur
				Bereitstellung des Nutzerkontos und der damit verbundenen Funktionen
				(Art. 6 Abs. 1 lit. b DSGVO). Ihre Daten werden gelöscht, sobald Sie Ihr
				Konto löschen.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>
				Anmeldung mit Google (Google-Login)
			</h3>
			<p>
				Auf dieser Website können Sie sich alternativ mit Ihrem Google-Konto
				anmelden. Anbieter ist die Google Ireland Limited, Gordon House, Barrow
				Street, Dublin 4, Irland. Wenn Sie den Google-Login wählen, werden Sie zur
				Anmeldung an Google weitergeleitet; dabei werden personenbezogene Daten
				(Google-ID, E-Mail-Adresse, Name und ggf. Profilbild) an uns übermittelt.
				Rechtsgrundlage ist Ihre Einwilligung, die Sie durch die Auswahl der
				Google-Anmeldung erteilen (Art. 6 Abs. 1 lit. a DSGVO), sowie die
				Bereitstellung des Nutzerkontos (Art. 6 Abs. 1 lit. b DSGVO). Weitere
				Informationen finden Sie in der Datenschutzerklärung von Google:{' '}
				<a
					href='https://policies.google.com/privacy'
					target='_blank'
					rel='noreferrer'
					className='text-blue-600 hover:underline'
				>
					policies.google.com/privacy
				</a>
				.
			</p>

			<h3 className='mt-4 mb-1 font-semibold text-gray-900'>Versand von E-Mails</h3>
			<p>
				Zur Bestätigung Ihrer Registrierung sowie für Funktionen wie das
				Zurücksetzen des Passworts versenden wir E-Mails über einen externen
				E-Mail-Dienst. Dabei wird Ihre E-Mail-Adresse an den Dienstleister
				übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
				(Vertragserfüllung).
			</p>

			<p className='mt-8 text-sm text-gray-400'>
				Quelle der Mustervorlage: eRecht24
			</p>

			<Link
				href={`/${locale}`}
				className='mt-10 inline-block text-blue-600 hover:underline'
			>
				← Zurück zur Startseite
			</Link>
		</div>
	)
}
