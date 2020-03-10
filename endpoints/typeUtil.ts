import Type from "../db/interfaces/Type";
import LangList, { Langs } from "../db/interfaces/LangList";
import { typeSimple } from "./types/type";

export function typeToTypeSimple(type: Type, lang: Langs): typeSimple {
	return {
		id: type,
		name: Type.toLang(type, lang)
	}
}
