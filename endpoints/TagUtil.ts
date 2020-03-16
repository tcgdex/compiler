import Tag, { TagSimple } from "@tcgdex/sdk/interfaces/Tag";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function tagToTagSimple(tag: Tag, lang: Langs): TagSimple {
	return {
		id: tag,
		name: TranslationUtil.translate("tag", tag, lang)
	}
}
