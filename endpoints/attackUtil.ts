import Attack from "@tcgdex/sdk/interfaces/Attack";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import Type from "@tcgdex/sdk/interfaces/Type";
import { AttackSingle } from "@tcgdex/sdk/interfaces/Attack";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function attackToAttackSingle(attack: Attack, lang: Langs): AttackSingle {
	return {
		name: attack.name[lang],
		cost: attack.cost && attack.cost.map(el => TranslationUtil.translate("type", el, lang)),
		text: attack.text && attack.text[lang],
		damage: attack.damage && attack.damage
	}
}
