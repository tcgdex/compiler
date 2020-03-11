import Type, { TypeSimple } from "@tcgdex/sdk/interfaces/Type";
import LangList, { Langs } from "@tcgdex/sdk/interfaces/LangList";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function typeToTypeSimple(type: Type, lang: Langs): TypeSimple {
	return {
		id: type,
		name: TranslationUtil.translate("type", type, lang)
	}
}
