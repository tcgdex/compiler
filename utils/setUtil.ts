import { Set, SupportedLanguages } from "db/interfaces"
import { smartGlob } from "./util"
import { cardToCardSimple, getCards } from './cardUtil'
import { SetResume, Set as SetSingle } from '@tcgdex/sdk/interfaces'

interface t {
	[key: string]: Set
}

const setCache: t = {}

// Dont use cache as it wont necessary have them all
export async function getSets(serie = '*'): Promise<Array<Set>> {
	const sets = (await smartGlob(`./db/data/${serie}/*.js`)).map((set) => set.substring(set.lastIndexOf('/')+1, set.lastIndexOf('.')))
	return Promise.all(sets.map((set) => getSet(set)))
}

/**
 * Return the set
 * @param name the name of the set (don't include.js/.ts)
 */
export async function getSet(name: string): Promise<Set> {
	if (!setCache[name]) {
		try {
			const [path] = await smartGlob(`./db/data/*/${name}.js`)
			setCache[name] = (await import(path.replace('./', '../'))).default
		} catch (e) {
			const set = (await getSets()).find((s) => s.id === name)
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

export function isSetAvailable(set: Set, lang: SupportedLanguages) {
	return lang in set.name
}

export async function setToSetSimple(set: Set, lang: SupportedLanguages): Promise<SetResume> {
	return {
		id: set.id,
		// logo: set.images && set.images.logo,
		// symbol: set.images && set.images.symbol,
		name: set.name[lang] as string,
		cardCount: {
			total: set.cardCount.total,
			official: set.cardCount.official
		},
	}
}

export async function setToSetSingle(set: Set, lang: SupportedLanguages): Promise<SetSingle> {
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
			official: set.cardCount.official
		},
		releaseDate: set.releaseDate,
		legal: set.legal && {
			standard: set.legal.standard,
			expanded: set.legal.expanded
		},
		// images: set.images && {
		// 	symbol: set.images.symbol,
		// 	logo: set.images.logo
		// },
		cards: await Promise.all((await getCards(lang, set)).map(([id, card]) => cardToCardSimple(id, card, lang)))
	}
}
