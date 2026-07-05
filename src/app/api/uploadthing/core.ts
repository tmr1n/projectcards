import { cookies } from 'next/headers'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
	avatarUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async () => {
			// Nur eingeloggte Nutzer dürfen hochladen — sonst könnte jeder
			// anonym Dateien in unseren UploadThing-Speicher laden (Quota-Abuse).
			const token = (await cookies()).get('token')?.value
			if (!token) throw new UploadThingError('Unauthorized')
			return {}
		})
		.onUploadComplete(async ({ file }) => {
			return { url: file.ufsUrl ?? file.url }
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
