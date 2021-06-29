import { StringEndpointList, StringEndpoint } from '@tcgdex/sdk/interfaces'
import translate from '../utils/translationUtil'
import { Card, Languages } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import { cardToCardSimple, getCards } from '../utils/cardUtil'

export default class implements Endpoint<StringEndpointList, StringEndpoint, Record<string, unknown>, Record<string, Array<[string, Card]>>> {

	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Record<string, Array<[string, Card]>>): Promise<StringEndpointList> {
		return Object.keys(common)
	}

	public async item(common: Record<string, Array<[string, Card]>>): Promise<Record<string, StringEndpoint>> {
		const items: Record<string, StringEndpoint> = {}
		for await (const key of Object.keys(common)) {
			const val = common[key]
			items[key] = {
				cards: await Promise.all(val.map(([id, card]) => cardToCardSimple(id, card, this.lang))),
				name: key
			}
		}
		return items
	}

	public async common(): Promise<Record<string, Array<[string, Card]>>> {
		return (await getCards(this.lang)).reduce((p, c) => {
			const types = c[1].types?.map((t) => translate('types', t, this.lang) as string)
			if (!types) {
				return p
			}
			for (const type of types) {
				if (!p[type]) {
					p[type] = []
				}
				p[type].push(c)
			}
			return p
		}, {} as Record<string, Array<[string, Card]>>)
	}

}
