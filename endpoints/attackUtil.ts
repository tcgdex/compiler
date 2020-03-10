import Attack from "../db/interfaces/Attack";
import { Langs } from "../db/interfaces/LangList";
import Type from "../db/interfaces/Type";
import { AttackSingle } from "../sdk/dist/types/interfaces/Attack";

export function attackToAttackSingle(attack: Attack, lang: Langs): AttackSingle {
	return {
		name: attack.name[lang],
		cost: attack.cost && attack.cost.map(el => Type.toLang(el, lang)),
		text: attack.text && attack.text[lang],
		damage: attack.damage && attack.damage
	}
}
