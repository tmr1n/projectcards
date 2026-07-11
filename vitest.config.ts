import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom', // «браузер в памяти» — чтобы рендерить компоненты
		setupFiles: ['./vitest.setup.ts']
	},
	resolve: {
		// чтобы в тестах работал импорт '@/...'
		alias: { '@': resolve(__dirname, './src') }
	}
})
