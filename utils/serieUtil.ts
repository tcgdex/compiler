import { smartGlob } from "./util"
import { setToSetSimple, getSets, getSet, isSetAvailable } from "./setUtil"
import { Serie, SupportedLanguages, Set } from 'db/interfaces'
import { Serie as SerieSingle, SerieResume } from '@tcgdex/sdk/interfaces'

export async function getSeries(lang: SupportedLanguages): Promise<Array<Serie>> {
	let series: Array<Serie> = (await Promise.all((await smartGlob('./db/data/*.js'))
		//Find Serie's name
		.map((it) => it.substring(it.lastIndexOf('/') + 1, it.length - 3))
		// Fetch the Serie
		.map((it) => getSerie(it))))
		// Filter the serie if no name's exists in the selected lang
		.filter((serie) => !!serie.name[lang])

	// Filter available series
	const isAvailable = await Promise.all(series.map((serie) => isSerieAvailable(serie, lang)))
	series = series.filter((_, index) => isAvailable[index])

	// Sort series by the first set release date
	const tmp: Array<[Serie, Set | undefined]> = await Promise.all(series.map(async (it) => {
		return [
			it,
			(await getSets(it.name.en, lang))
				.reduce<Set | undefined>((p, c) => p ? p.releaseDate < c.releaseDate ? p : c : c, undefined) as Set] as [Serie, Set]
	}))

	return tmp.sort((a, b) => (a[1] ? a[1].releaseDate : '0') > (b[1] ? b[1].releaseDate : '0') ? 1 : -1).map((it) => it[0])
}

export async function getSerie(name: string): Promise<Serie> {
	return (await import(`../db/data/${name}.js`)).default
}

export async function isSerieAvailable(serie: Serie, lang: SupportedLanguages) {
	if (!serie.name[lang]) {
		return false
	}
	const sets = (await getSets(serie.name.en, lang))
	return sets.length > 0
}

export async function serieToSerieSimple(serie: Serie, lang: SupportedLanguages): Promise<SerieResume> {
	return {
		id: serie.id,
		name: serie.name[lang] as string
	}
}

export async function serieToSerieSingle(serie: Serie, lang: SupportedLanguages): Promise<SerieSingle> {
	const setsTmp = await getSets(serie.name.en, lang)
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
