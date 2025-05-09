// /**
//  * retourne la moyenne du nombre de phrases dans les 3 textes
//  * @param nbSentencesText1 nombre de phrases dans le texte 1
//  * @param nbSentencesText2 nombre de phrases dans le texte 2
//  * @param nbSentencesText3 nombre de phrases dans le texte 3
//  * @returns {number} la moyenne du nombre de phrases
//  */
// function countAverageSentences(nbSentencesText1, nbSentencesText2, nbSentencesText3) {
//     // calcule la moyenne des 3 textes
//     return (nbSentencesText3 + nbSentencesText3 + nbSentencesText3)/3;
// }
//
// /**
//  * retourne la moyenne du nombre de syllabes dans les 3 textes
//  * @param nbSyllabsText1 nombre de syllabes dans le texte 1
//  * @param nbSyllabsText2 nombre de syllabes dans le texte 1
//  * @param nbSyllabsText3 nombre de syllabes dans le texte 3
//  * @returns {number} la moyenne du nombre de syllabes
//  */
// function countAverageSyllabs(nbSyllabsText1, nbSyllabsText2, nbSyllabsText3) {
//     // calcule la moyenne des 3 textes
//     return (nbSyllabsText1 + nbSyllabsText2 + nbSyllabsText3)/3;
// }

import {averageWordsInSentence, averageSyllabsNumber, getWordsList} from "@/js/ressources.js";

/**
 * Calcul la lisibilité du text passé en paramètre par rapport à l'algorithme de de Fry
 * @param textBrut Text à analyser
 * @returns {number[]} Cordonnées sur le graphique de Fry
 */
export async function getFryResult(textBrut) {
    const words = getWordsList(textBrut)

    return [await averageSyllabsNumber(words), averageWordsInSentence(textBrut)]
}