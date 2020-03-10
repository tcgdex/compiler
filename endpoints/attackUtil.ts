import Attack from "../db/interfaces/Attack";
import { Langs } from "../db/interfaces/LangList";
import { attackSingle } from "./attacks/attack";
import Type from "../db/interfaces/Type";

export function attackToAttackSingle(attack: Attack, lang: Langs): attackSingle {
	return {
		name: attack.name[lang],
		cost: attack.cost && attack.cost.map(el => Type.toLang(el, lang)),
		text: attack.text && attack.text[lang],
		damage: attack.damage && attack.damage
	}
}
