import { smartGlob } from "./util"
import { setToSetSimple, getSets } from "./setUtil"
import { Serie, SupportedLanguages, Set } from 'db/interfaces'
import { Serie as SerieSingle, SerieResume } from '@tcgdex/sdk/interfaces'

export async function getSeries(): Promise<Array<Serie>> {
	const series = await Promise.all((await smartGlob('./db/data/*.js'))
		.map((it) => it.substring(it.lastIndexOf('/') + 1, it.length - 3))
		.map((it) => getSerie(it)))
	const tmp: Array<[Serie, Set | undefined]> = await Promise.all(series.map( async (it) => {
		return [it, (await getSets(it.name.en)).reduce<Set | undefined>((p, c) => p ? p.releaseDate < c.releaseDate ? p : c : c, undefined) as Set] as [Serie, Set]
	}))
	tmp.forEach((t) => !t[1] && console.log(t[0].name) )
	return tmp.sort((a, b) => (a[1] ? a[1].releaseDate : '0') > (b[1] ? b[1].releaseDate : '0') ? 1 : -1).map((it) => it[0])
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
