import { SupportedLanguages, Types } from 'db/interfaces'

type translatable = 'types' | 'rarity' | 'stage' | 'category' | 'suffix' | 'abilityType' | 'trainerType' | 'energyType'

const translations: Record<string, Record<translatable, Record<string, string>>> = {
	fr: {
		types: {
			'Colorless': 'Incolore',
			'Darkness': 'Obscurité',
			'Dragon': 'Dragon',
			'Fairy': 'Fée',
			'Fightning': 'Combat',
			'Fire': 'Feu',
			'Grass': 'Plante',
			'Lightning': 'Électrique',
			'Metal': 'Métal',
			'Psychic': 'Psy',
			'Water': 'Eau'
		},
		rarity: {
			'None': 'Rien',
			'Common': 'Commune',
			'Uncommon': 'Non Commune',
			'Rare': 'Rare',
			'Ultra Rare': 'Ultra Rare',
			'Secret Rare': 'Magnifique rare'
		},
		stage: {
			"Basic": 'Base',
			"BREAK": 'TURBO',
			"LEVEL-UP": 'Niveau Sup',
			"MEGA": 'MÉGA',
			"RESTORED": 'RECRÉE',
			"Stage1": 'Niveau1',
			"Stage2": 'Biveau2',
			"VMAX": 'VMAX'
		},
		category: {
			Pokemon: 'Pokémon',
			Trainer: 'Dresseur',
			Energy: 'Énergie'
		},
		suffix: {
			'EX': 'EX',
			'GX': 'GX',
			'V': 'V',
			'Legend': 'LÉGENDE',
			'Prime': 'Prime',
			'SP': 'SP',
			'TAG TEAM-GX': 'TAG TEAM-GX',
		},
		abilityType: {
			'Pokemon Power': 'Pouvoir Pokémon',
			'Poke-BODY': 'Poké-BODY',
			'Poke-POWER': 'Poké-POWER',
			'Ability': 'Talent',
			'Ancient Trait': 'Trait Antique'
		},
		trainerType: {
			'Supporter': 'Supporter',
			'Item': 'Objet',
			'Stadium': 'Stade',
			'Tool': 'Outil',
			'Ace Spec': 'High-Tech',
			'Technical Machine': 'Machine Technique',
			'Goldenred Game Corner': 'Salle de jeu de Doublonville',
			'Rocket\'s Secret Machine': 'Machine secrète des Rocket'
		},
		energyType: {
			Normal: 'Normal',
			Special: 'Spécial'
		},
	}
}

export default function translate(item: translatable, key: string | undefined, lang: SupportedLanguages) {
	if (!key) {
		return key
	}
	if (lang === 'en') {
		return key
	}
	const res = translations[lang]?.[item]?.[key]
	if (!res) {
		throw new Error(`Could not find translation for ${lang}${item}.${key}`);
	}
	return res
}

export function translateType(type: Types, lang: SupportedLanguages) {
	return translate('types', type, lang)

}

export function translateStage(stage: string, lang: SupportedLanguages) {
	return translate('stage', stage, lang)
}

export function translateRarity(rarity: string, lang: SupportedLanguages) {
	return translate('rarity', rarity, lang)
}
