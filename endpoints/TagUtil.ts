import Tag from "@tcgdex/sdk/interfaces/Tag";
import { Langs } from "@tcgdex/sdk/interfaces/LangList";
import { tagSimple } from "./tags/tag";
import TranslationUtil from "@tcgdex/sdk/TranslationUtil";

export function tagToTagSimple(tag: Tag, lang: Langs): tagSimple {
	return {
		id: tag,
		name: TranslationUtil.translate("tag", tag, lang)
	}
}
