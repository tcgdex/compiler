import { SupportedLanguages } from 'db/interfaces'

type translatable = 'types' | 'rarity' | 'stage' | 'category' | 'suffix' | 'abilityType' | 'trainerType' | 'energyType'

const translations: Record<string, Record<translatable, Record<string, string>>> = {
	es: {
		abilityType: {
			'Ability': 'Habilidad',
			// Missing
			'Ancient Trait': 'Ancient Trait',
			// Missing
			'Poke-BODY': 'Poke-BODY',
			// Missing
			'Poke-POWER': 'Poke-POWER',
			// Missing
			'Pokemon Power': 'Pokemon Power'

		},
		category: {
			Energy: 'Energía',
			Pokemon: 'Pokémon',
			Trainer: 'Entrenador'
		},
		energyType: {
			Normal: 'Básico',
			Special: 'Especial'
		},
		rarity: {
			'Amazing': 'Increíbles',
			'Common': 'Commún',
			'None': 'Ninguno',
			'Rare': 'Rara',
			'Secret Rare': 'Rara Secreto',
			'Ultra Rare': 'Rara Ultra',
			'Uncommon': 'Uncommon'
		},
		stage: {
			'BREAK': 'TURBO',
			'Basic': 'Basico',
			'LEVEL-UP': 'Subir de nivel',
			'MEGA': 'MEGA',
			'RESTORED': 'Recreado',
			'Stage1': 'Fase 1',
			'Stage2': 'Fase 2',
			'VMAX': 'VMAX'
		},
		suffix: {
			'EX': 'EX',
			'GX': 'GX',
			'Legend': 'LEYENDA',
			'Prime': 'Prime',
			'SP': 'SP',
			'TAG TEAM-GX': 'TAG TEAM-GX',
			'V': 'V'
		},
		trainerType: {
			// Missing
			'Ace Spec': 'Ace Spec',
			// Missing
			'Goldenrod Game Corner': 'Goldenrod Game Corner',
			'Item': 'Objeto',
			'Rocket\'s Secret Machine': 'Máquina Secreta de Rocket',
			'Stadium': 'Estaio',
			'Supporter': 'Partidario',
			'Technical Machine': 'Máquina Técnica',
			'Tool': 'Herramienta'
		},
		types: {
			Colorless: 'Incolora',
			Darkness: 'Oscura',
			Dragon: 'Dragón',
			Fairy: 'Hada',
			Fighting: 'Lucha',
			Fire: 'Guego',
			Grass: 'Planta',
			Lightning: 'Rayo',
			Metal: 'Metálica',
			Psychic: 'Psíquico',
			Water: 'Agua'
		}
	},
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
			Normal: 'De base',
			Special: 'Spécial'
		},
		rarity: {
			'Amazing': 'Magnifique',
			'Common': 'Commune',
			'None': 'Sans Rareté',
			'Rare': 'Rare',
			'Secret Rare': 'Magnifique rare',
			'Ultra Rare': 'Ultra Rare',
			'Uncommon': 'Peu Commune'
		},
		stage: {
			'BREAK': 'TURBO',
			'Basic': 'De base',
			'LEVEL-UP': 'Niveau Sup',
			'MEGA': 'MÉGA',
			'RESTORED': 'Restauré',
			'Stage1': 'Niveau 1',
			'Stage2': 'Niveau 2',
			'VMAX': 'ESCOUADE'
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
			'Goldenrod Game Corner': 'Salle de jeu de Doublonville',
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
	// Temporary trenslations are in english while they are being worked on
	if (lang === 'en' || !Object.keys(translations).includes(lang)) {
		return key
	}
	const res = translations[lang]?.[item]?.[key]
	if (!res) {
		throw new Error(`Could not find translation for ${lang}${item}.${key}`)
	}
	return res
}
