import { Serie as SerieSingle, StringEndpoint, SerieList } from '@tcgdex/sdk/interfaces'
import { Card, Languages, Serie } from '../db/interfaces'
import { Endpoint } from '../interfaces'
import Logger from '@dzeio/logger'
import { cardToCardSimple, cardToCardSingle, getCards } from '../utils/cardUtil'
import { basename } from 'path'
import { getSeries, serieToSerieSimple, serieToSerieSingle } from '../utils/serieUtil'

const logger = new Logger(basename(__filename))

export default class implements Endpoint<SerieList, SerieSingle, {}, Array<Serie>> {
	public constructor(
		private lang: keyof Languages
	) {}

	public async index(common: Array<Serie>) {
		return Promise.all(common.map((s) => serieToSerieSimple(s, this.lang)))
	}

	public async item(common: Array<Serie>) {
		const items: Record<string, SerieSingle> = {}
		for (let key = 0; key < common.length; key++) {
			const val = common[key];
			items[key] = await serieToSerieSingle(val, this.lang)
		}
		return items
	}

	public async common() {
		return getSeries()
	}
}
