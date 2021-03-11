import { SetList, Set as SetSingle, Card as CardSingle } from '@tcgdex/sdk/interfaces'
import { getSet, getSets, isSetAvailable, setToSetSimple, setToSetSingle } from "../utils/setUtil"
import { Languages, Set } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import Logger from '@dzeio/logger'
import { cardToCardSingle, getCards } from '../utils/cardUtil'
import { basename } from 'path'

const logger = new Logger(basename(__filename))

export default class implements Endpoint<SetList, SetSingle, CardSingle, Array<Set>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Array<Set>) {
		const sets = common
			.sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1)

		const tmp: SetList = await Promise.all(sets.map((el) => setToSetSimple(el, this.lang)))

		return tmp
	}

	public async item(common: Array<Set>) {
		const sets= await Promise.all(common
			.map((set) => setToSetSingle(set, this.lang)))
		const res: Record<string, SetSingle> = {}

		for (const set of sets) {
			res[set.name] = set
			res[set.id] = set
		}

		return res
	}

	public async common() {
		return (await getSets())
			.filter((set) => isSetAvailable(set, this.lang))
	}

	public async sub(common: Array<Set>, item: string) {
		const set = await getSet(item)

		if (!isSetAvailable(set, this.lang)) return undefined

		const lit = await getCards(set)
		const l: Record<string, CardSingle> = {}
		for (let i of lit) {
			l[i[0]] = await cardToCardSingle(i[0], i[1], this.lang)
		}

		return l
	}
}
