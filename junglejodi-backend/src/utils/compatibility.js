/**
 * Logic to check if two animals are compatible based on ecosystem stats
 */
export const calculateCompatibility = (animalA, animalB) => {
    let score = 0;

    // Trophic Level Compatibility (Herbivores love herbivores, predators have risks)
    const trophicA = animalA.ecosystem_stats.trophic_level;
    const trophicB = animalB.ecosystem_stats.trophic_level;

    if (Math.abs(trophicA - trophicB) <= 1) score += 40;

    // Diet sync
    const dietA = animalA.ecosystem_stats.diet_type;
    const dietB = animalB.ecosystem_stats.diet_type;

    if (dietA === dietB) score += 30;
    else if (
        (dietA === 'Omnivore' && (dietB === 'Herbivore' || dietB === 'Omnivore')) ||
        (dietB === 'Omnivore' && (dietA === 'Herbivore' || dietA === 'Omnivore'))
    ) {
        score += 20;
    }

    // Activity Period (Sleep Sync)
    const activityA = animalA.ecosystem_stats.activity_period;
    const activityB = animalB.ecosystem_stats.activity_period;

    if (activityA === activityB) score += 30;
    else if (
        (activityA === 'Crepuscular' && (activityB === 'Diurnal' || activityB === 'Nocturnal')) ||
        (activityB === 'Crepuscular' && (activityA === 'Diurnal' || activityA === 'Nocturnal'))
    ) {
        score += 15;
    }

    // Predator Risk Check (Fail safe)
    const isPredatorRisk = (dietA === 'Carnivore' && dietB === 'Herbivore') ||
        (dietB === 'Carnivore' && dietA === 'Herbivore');

    if (isPredatorRisk) score = Math.max(0, score - 50);

    return {
        score,
        isCompatible: score >= 50,
        riskLevel: isPredatorRisk ? 'High' : (score < 40 ? 'Moderate' : 'Low')
    };
};
