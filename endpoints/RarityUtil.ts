import Rarity from "@tcgdex/sdk/interfaces/Rarity";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import { raritySimple } from "./rarities/rarity";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function rarityToRaritySimple(rarity: Rarity, lang: Langs): raritySimple {
	return {
		id: rarity,
		name: TranslationUtil.translate("rarity", rarity, lang)
	}
}
