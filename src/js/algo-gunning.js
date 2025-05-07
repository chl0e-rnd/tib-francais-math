import {averageWordsInSentence, countComplexWords, getWordsList} from "@/js/ressources.js";

/**
 * Calcule l'indice de lisibilité de Gunning.
 * @param {string} textBrut - Le texte à analyser.
 * @returns {number} - L'indice Gunning Fog du texte.
 */
export function getGunningResult(textBrut) {
    const wordsNumber = getWordsList(textBrut).length;
    const complexWordsNumber = countComplexWords(textBrut);

    return 0.4 * (averageWordsInSentence(textBrut) + 100 * (complexWordsNumber / wordsNumber));
}

