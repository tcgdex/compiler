/* eslint-disable max-statements */
import { SupportedLanguages } from 'db/interfaces'
import { Endpoint } from 'interfaces'
import { promises as fs } from 'fs'
import { objectMap } from '@dzeio/object-util'
import { urlize, fetchRemoteFile } from './utils/util'
import { config } from 'dotenv'

config()

const lang: SupportedLanguages = process.env.TCGDEX_COMPILER_LANG as SupportedLanguages ?? 'en'

const VERSION = 'v2'

;(async () => {
	const paths = (await fs.readdir('./endpoints')).filter((f) => f.endsWith('.ts'))

	console.log('Prefetching pictures')
	await fetchRemoteFile('https://assets.tcgdex.net/datas.json')

	await fs.rm(`./dist/${VERSION}/${lang}`, { force: true, recursive: true })
	console.log('Let\'s GO !')
	for await (const file of paths) {
		const path = `./endpoints/${file}`
		console.log(file, 'Running Init')
		const Ep = (await import(path)).default
		const endpoint = new Ep(lang) as Endpoint
		console.log(file, 'Running Common')
		let common: any | null = null
		if (endpoint.common) {
			common = await endpoint.common()
		}
		console.log(file, 'Running Index')
		const folder = `./dist/${VERSION}/${lang}/${urlize(path.replace('./endpoints/', '').replace('.ts', ''))}`
		await fs.mkdir(folder, { recursive: true })
		await fs.writeFile(`${folder}/index.json`, JSON.stringify(
			await endpoint.index(common)
		))
		console.log(file, 'Finished Index')
		console.log(file, 'Running Item')
		const item = await endpoint.item(common)
		if (!item) {
			console.log(file, 'skipped Item')
			continue
		}
		for await (const key of Object.keys(item)) {
			const val = item[key]
			const subFolder = `${folder}/${urlize(key)}`
			await fs.mkdir(subFolder, { recursive: true })
			await fs.writeFile(`${subFolder}/index.json`, JSON.stringify(val))
			if (endpoint.sub) {
				console.log(file, 'Running subItem', key)
				const subItems = await endpoint.sub(common, key)
				if (subItems) {
					await Promise.all(objectMap(subItems, async (subVal, sybKey) => {
						const subSubFolder = `${subFolder}/${urlize(sybKey)}`
						await fs.mkdir(subSubFolder, { recursive: true })
						await fs.writeFile(`${subSubFolder}/index.json`, JSON.stringify(subVal))
					}))
				}
				console.log(file, 'Finished subItem', key)
			}
		}
		console.log(file, 'Finished Item')
	}
})()
