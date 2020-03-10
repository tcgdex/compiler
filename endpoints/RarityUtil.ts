import Rarity from "../db/interfaces/Rarity";
import { Langs } from "../db/interfaces/LangList";
import { raritySimple } from "./rarities/rarity";

export function rarityToRaritySimple(rarity: Rarity, lang: Langs): raritySimple {
	return {
		id: rarity,
		name: Rarity.toLang(rarity, lang)
	}
}
