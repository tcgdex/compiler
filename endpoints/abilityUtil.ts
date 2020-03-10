import Ability from "../db/interfaces/Ability";
import { Langs } from "../db/interfaces/LangList";
import AbilityType from "../db/interfaces/AbilityType";
import { AbilitySimple, AbilitySingle } from "../sdk/dist/types/interfaces/Ability";

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
			name: AbilityType.toLang(ability.type, lang)
		}
	}
}
