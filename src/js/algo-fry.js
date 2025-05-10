import {averageWordsInSentence, averageSyllabsNumber, getWordsList} from "@/js/ressources.js";

/**
 * Calcul la lisibilité du text passé en paramètre par rapport à l'algorithme de de Fry
 * @param textBrut Text à analyser
 * @returns {number[]} Cordonnées sur le graphique de Fry
 */
export async function getFryResult(textBrut) {
    const words = getWordsList(textBrut)

    return [(await averageSyllabsNumber(words)).averageSyllabsNumber * 100, averageWordsInSentence(textBrut)]
}