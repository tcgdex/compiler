import Ability from "../db/interfaces/Ability";
import { Langs } from "../db/interfaces/LangList";
import { abilitySimple, abilitySingle } from "./abilities/ability";
import AbilityType from "../db/interfaces/AbilityType";

export function abilityToAbilitySimple(ability: Ability, lang: Langs): abilitySimple {
	return {
		name: ability.name[lang]
	}
}

export function abilityToAbilitySingle(ability: Ability, lang: Langs): abilitySingle {
	return {
		name: ability.name[lang],
		text: ability.text[lang],
		type: {
			id: ability.type,
			name: AbilityType.toLang(ability.type, lang)
		}
	}
}
