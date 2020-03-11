import Rarity, { RaritySimple } from "@tcgdex/sdk/interfaces/Rarity";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function rarityToRaritySimple(rarity: Rarity, lang: Langs): RaritySimple {
	return {
		id: rarity,
		name: TranslationUtil.translate("rarity", rarity, lang)
	}
}
