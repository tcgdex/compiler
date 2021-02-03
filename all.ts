import Logger from '@dzeio/logger'
const logger = new Logger('Compiler')

import cardIndex from './endpoints/cards/index'
import cardItem from './endpoints/cards/item'

import categoriesIndex from './endpoints/categories/index'
import categoriesItem from './endpoints/categories/item'

import expansionsIndex from './endpoints/expansions/index'
import expansionsItem from './endpoints/expansions/item'

import hpIndex from './endpoints/hp/index'
import hpItem from './endpoints/hp/item'

import illustratorsIndex from './endpoints/illustrators/index'
import illustratorsItem from './endpoints/illustrators/item'
import illustratorsDB from './endpoints/illustrators/updateDB'

import raritiesIndex from './endpoints/rarities/index'
import raritiesItem from './endpoints/rarities/item'


import retreatIndex from './endpoints/retreat/index'
import retreatItem from './endpoints/retreat/item'

import setsIndex from './endpoints/sets/index'
import setsItem from './endpoints/sets/item'
import setsSubItem from './endpoints/sets/subitem'


import typesIndex from './endpoints/types/index'
import typesItem from './endpoints/types/item'

import tagsIndex from './endpoints/tags/index'
import tagsItem from './endpoints/tags/item'
import { fetchRemoteFile } from './endpoints/util'


(async () => {
	logger.log('Preparing Database Update')
	await Promise.all([
		illustratorsDB(),
		fetchRemoteFile('https://assets.tcgdex.net/data-en.json'),
		fetchRemoteFile('https://assets.tcgdex.net/data-fr.json'),
		fetchRemoteFile('https://assets.tcgdex.net/data-univ.json')
	])
	logger.log('UPDATING...')
	await Promise.all([
		cardIndex(),
		cardItem(),

		categoriesIndex(),
		categoriesItem(),

		expansionsIndex(),
		expansionsItem(),

		hpIndex(),
		hpItem(),

		illustratorsIndex(),
		illustratorsItem(),
		illustratorsDB(),

		raritiesIndex(),
		raritiesItem(),


		retreatIndex(),
		retreatItem(),

		setsIndex(),
		setsItem(),
		setsSubItem(),

		typesIndex(),
		typesItem(),

		tagsIndex(),
		tagsItem(),
	])
	process.exit(0)
})()
