import { StringEndpointList, StringEndpoint } from '@tcgdex/sdk/interfaces'
import translate from '../utils/translationUtil'
import { Card, Languages } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import { cardToCardSimple, getCards } from '../utils/cardUtil'

export default class implements Endpoint<StringEndpointList, StringEndpoint, {}, Record<string, Array<[string, Card]>>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Record<string, Array<[string, Card]>>) {
		return Object.keys(common)
	}

	public async item(common: Record<string, Array<[string, Card]>>) {
		const items: Record<string, StringEndpoint> = {}
		for (const key of Object.keys(common)) {
			const val = common[key]
			const it = {
				name: key,
				cards: await Promise.all(val.map(([id, card]) => cardToCardSimple(id, card, this.lang)))
			}
			items[key] = it
		}
		return items
	}

	public async common() {
		return (await getCards(this.lang)).reduce((p, c) => {
			const category = translate('category', c[1].category, this.lang)
			if (!category) return p
			if (!p[category]) {
				p[category] = []
			}
			p[category].push(c)
			return p
		}, {} as Record<string, Array<[string, Card]>>)
	}
}
