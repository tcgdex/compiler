import { Set, SupportedLanguages } from "db/interfaces"
import { fetchRemoteFile, smartGlob } from "./util"
import { cardToCardSimple, getCards } from './cardUtil'
import { SetResume, Set as SetSingle } from '@tcgdex/sdk/interfaces'

interface t {
	[key: string]: Set
}

const setCache: t = {}

// Dont use cache as it wont necessary have them all
export async function getSets(serie = '*', lang: SupportedLanguages): Promise<Array<Set>> {
	// list sets names
	const rawSets = (await smartGlob(`./db/data/${serie}/*.js`)).map((set) => set.substring(set.lastIndexOf('/')+1, set.lastIndexOf('.')))
	// Fetch sets
	const sets = (await Promise.all(rawSets.map((set) => getSet(set, serie, lang))))
		// Filter sets
		.filter((set) => isSetAvailable(set, lang))
		// Sort sets by release date
		.sort((a, b) => {
			return a.releaseDate > b.releaseDate ? 1 : -1
		})
	return sets
}

/**
 * Return the set
 * @param name the name of the set (don't include.js/.ts)
 */
export async function getSet(name: string, serie = '*', lang: SupportedLanguages): Promise<Set> {
	if (!setCache[name]) {
		try {
			const [path] = await smartGlob(`./db/data/${serie}/${name}.js`)
			setCache[name] = (await import(path.replace('./', '../'))).default
		} catch (e) {
			const set = (await getSets(undefined, lang)).find((s) => s.id === name)
			if (set) {
				return set
			}
			console.error(e)
			console.error(`Error trying to import importing (${`db/data/*/${name}.js`})`)
			process.exit(1)
		}
	}
	return setCache[name]
}

export function isSetAvailable(set: Set, lang: SupportedLanguages): boolean {
	return lang in set.name && lang in set.serie.name
}

export async function getSetPictures(set: Set, lang: SupportedLanguages): Promise<[string | undefined, string | undefined]> {
	try {
		const file = await fetchRemoteFile(`https://assets.tcgdex.net/datas.json`)
		const logoExists = !!file[lang]?.[set.serie.id]?.[set.id]?.logo ? `https://assets.tcgdex.net/${lang}/${set.serie.id}/${set.id}/logo` : undefined
		const symbolExists = !!file.univ?.[set.serie.id]?.[set.id]?.symbol ? `https://assets.tcgdex.net/univ/${set.serie.id}/${set.id}/symbol` : undefined
		return [
			logoExists,
			symbolExists
		]
	} catch {
		return [undefined, undefined]
	}
}

export async function setToSetSimple(set: Set, lang: SupportedLanguages): Promise<SetResume> {
	const pics = await getSetPictures(set, lang)
	return {
		id: set.id,
		logo: pics[0],
		symbol: pics[1],
		name: set.name[lang] as string,
		cardCount: {
			total: set.cardCount.total,
			official: set.cardCount.official
		},
	}
}

export async function setToSetSingle(set: Set, lang: SupportedLanguages): Promise<SetSingle> {
	const cards = await getCards(lang, set)
	const pics = await getSetPictures(set, lang)
	return {
		name: set.name[lang] as string,
		id: set.id,
		serie: {
			id: set.serie.id,
			name: set.serie.name[lang] as string
		},
		tcgOnline: set.tcgOnline,
		cardCount: {
			total: set.cardCount.total,
			official: set.cardCount.official,
			normal: cards.reduce((count, card) => count + (card[1].variants?.normal ?? set.variants?.normal ? 1 : 0), 0),
			reverse: cards.reduce((count, card) => count + (card[1].variants?.reverse ?? set.variants?.reverse ? 1 : 0), 0),
			holo: cards.reduce((count, card) => count + (card[1].variants?.holo ?? set.variants?.holo ? 1 : 0), 0),
			firstEd: cards.reduce((count, card) => count + (card[1].variants?.firstEdition ?? set.variants?.firstEdition ? 1 : 0), 0),
		},
		releaseDate: set.releaseDate,
		legal: set.legal && {
			standard: set.legal.standard,
			expanded: set.legal.expanded
		},
		logo: pics[0],
		symbol: pics[1],
		cards: await Promise.all(cards.map(([id, card]) => cardToCardSimple(id, card, lang)))
	}
}
