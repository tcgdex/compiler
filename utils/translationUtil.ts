import { SupportedLanguages } from 'db/interfaces'

type translatable = 'types' | 'rarity' | 'stage' | 'category' | 'suffix' | 'abilityType' | 'trainerType' | 'energyType'

const translations: Record<string, Record<translatable, Record<string, string>>> = {
	fr: {
		abilityType: {
			'Ability': 'Talent',
			'Ancient Trait': 'Trait Antique',
			'Poke-BODY': 'Poké-BODY',
			'Poke-POWER': 'Poké-POWER',
			'Pokemon Power': 'Pouvoir Pokémon'
		},
		category: {
			Energy: 'Énergie',
			Pokemon: 'Pokémon',
			Trainer: 'Dresseur'
		},
		energyType: {
			Normal: 'Normal',
			Special: 'Spécial'
		},
		rarity: {
			'Common': 'Commune',
			'None': 'Rien',
			'Rare': 'Rare',
			'Secret Rare': 'Magnifique rare',
			'Ultra Rare': 'Ultra Rare',
			'Uncommon': 'Non Commune'
		},
		stage: {
			'BREAK': 'TURBO',
			'Basic': 'Base',
			'LEVEL-UP': 'Niveau Sup',
			'MEGA': 'MÉGA',
			'RESTORED': 'RECRÉE',
			'Stage1': 'Niveau1',
			'Stage2': 'Niveau2',
			'VMAX': 'VMAX'
		},
		suffix: {
			'EX': 'EX',
			'GX': 'GX',
			'Legend': 'LÉGENDE',
			'Prime': 'Prime',
			'SP': 'SP',
			'TAG TEAM-GX': 'TAG TEAM-GX',
			'V': 'V'
		},
		trainerType: {
			'Ace Spec': 'High-Tech',
			'Goldenred Game Corner': 'Salle de jeu de Doublonville',
			'Item': 'Objet',
			'Rocket\'s Secret Machine': 'Machine secrète des Rocket',
			'Stadium': 'Stade',
			'Supporter': 'Supporter',
			'Technical Machine': 'Machine Technique',
			'Tool': 'Outil'
		},
		types: {
			Colorless: 'Incolore',
			Darkness: 'Obscurité',
			Dragon: 'Dragon',
			Fairy: 'Fée',
			Fighting: 'Combat',
			Fire: 'Feu',
			Grass: 'Plante',
			Lightning: 'Électrique',
			Metal: 'Métal',
			Psychic: 'Psy',
			Water: 'Eau'
		}

	}
}

export default function translate(item: translatable, key: string | undefined, lang: SupportedLanguages): string | undefined {
	if (!key) {
		return key
	}
	if (lang === 'en') {
		return key
	}
	const res = translations[lang]?.[item]?.[key]
	if (!res) {
		throw new Error(`Could not find translation for ${lang}${item}.${key}`)
	}
	return res
}
