import Tag from "../db/interfaces/Tag";
import { Langs } from "../db/interfaces/LangList";
import { tagSimple } from "./tags/tag";

export function tagToTagSimple(tag: Tag, lang: Langs): tagSimple {
	return {
		id: tag,
		name: Tag.toLang(tag, lang)
	}
}
