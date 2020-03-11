import Ability from "@tcgdex/sdk/interfaces/Ability";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import AbilityType from "@tcgdex/sdk/interfaces/AbilityType";
import { AbilitySimple, AbilitySingle } from "@tcgdex/sdk/interfaces/Ability";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function abilityToAbilitySimple(ability: Ability, lang: Langs): AbilitySimple {
	return {
		name: ability.name[lang]
	}
}

export function abilityToAbilitySingle(ability: Ability, lang: Langs): AbilitySingle {
	return {
		name: ability.name[lang],
		text: ability.text[lang],
		type: {
			id: ability.type,
			name: TranslationUtil.translate("abilityType", ability.type, lang)
		}
	}
}
