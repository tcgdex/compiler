import { smartGlob } from "./util"
import { setToSetSimple, getSets } from "./setUtil"
import Logger from "@dzeio/logger"
import { Serie, SupportedLanguages } from 'db/interfaces'
import { Serie as SerieSingle, SerieResume } from '@tcgdex/sdk/interfaces'

const logger = new Logger('ExpansionUtils')

export async function getSeries(): Promise<Array<Serie>> {
	return Promise.all((await smartGlob('./db/data/*.js'))
		.map((it) => it.substring(it.lastIndexOf('/') + 1, it.length - 3))
		.map((it) => getSerie(it)))
}

export async function getSerie(name: string): Promise<Serie> {
	return (await import(`../db/data/${name}.js`)).default
}

export async function serieToSerieSimple(serie: Serie, lang: SupportedLanguages): Promise<SerieResume> {
	return {
		id: serie.id,
		name: serie.name[lang] as string
	}
}

export async function serieToSerieSingle(serie: Serie, lang: SupportedLanguages): Promise<SerieSingle> {
	const setsTmp = await getSets(serie.name.en)
	const sets = await Promise.all(setsTmp
		.sort((a, b) => {
			return a.releaseDate > b.releaseDate ? 1 : -1
		})
		.map(el => setToSetSimple(el, lang)))
	return {
		id: serie.id,
		name: serie.name[lang] as string,
		sets
	}
}
