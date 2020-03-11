import { cardSimple } from "../cards/card";

export interface tagSimple {
	id: number
	name: string
}

export interface tagSingle extends tagSimple {
	cards: Array<cardSimple>
}

export interface tagList {
	count: number
	list: Array<tagSimple>
}
