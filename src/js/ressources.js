//Déclaration des constantes
const MAX_SYLLABS = 3;
const INVALID_WORD = -1;

/**
 * Récupère tous les mots d'un texte
 * @param textBrut Le texte brut.
 * @returns {[string]} Retoune une liste de chacun des mots présent dans un texte
 */
export function getWordsList(textBrut) {

    const segmenter = new Intl.Segmenter([], { granularity: 'word' });
    const segmentedText = segmenter.segment(textBrut);
    return [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);

}


/**
 * Compte le nombre de phrases dans le texte.
 * @param textBrut Le texte brut à analyser.
 * @returns {*|number} Retoune le nombre de phrases dans le texte.
 */
function countSentences(textBrut) {
    const segmenter = new Intl.Segmenter([], { granularity: 'sentence' });
    const segmentedText = segmenter.segment(textBrut);
    return [...segmentedText].map(s => s.segment).length;
}

/**
 * compte le nombre de mots complexes (plus de 3 syllabes) dans un text
 * @param text texte traité
 * @returns Promise<number>
 */
export async function countComplexWords(text) {
    let complexWords = 0; // nombre de mots complexes
    const wordsList = getWordsList(text); // liste de mots dans le texte

    // traite chaque mot du texte
    for (const word of wordsList) {
        let syllabs = await getSyllabsNumber(word);

        // si un mot contient plus de 3 syllabes et que ce n'est pas un nom propre et que ce n'est pas un nom composé, il y a un mot de plus dans le texte
        if (syllabs >= MAX_SYLLABS && syllabs !== INVALID_WORD && !word.includes('-')) {
            complexWords++;
        }
    }
    // renvoie le nombre de mot complexe dans le texte
    return complexWords;
}

/**
 *
 * @param textBrut
 * @returns
 */
export async function averageSyllabsNumber(wordsList, batchSize = 10) {
    let totalSyllabsNumber = 0;
    let invalidWords = 0;

    for (let i = 0; i < wordsList.length; i += batchSize) {
        const batch = wordsList.slice(i, i + batchSize);

        const results = await Promise.all(
            batch.map(async (word) => {
                return await getSyllabsNumber(word);
            })
        );

        for (const syllabsNumber of results) {
            if (syllabsNumber === INVALID_WORD) {
                invalidWords++;
            } else {
                totalSyllabsNumber += syllabsNumber;
            }
        }

        // laisser le navigateur respirer après chaque batch
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    return {
        averageSyllabsNumber: totalSyllabsNumber / (wordsList.length - invalidWords),
        invalidWords: invalidWords
    };
}


/**
 * renvoie le nombre de syllabes dans un mot
 * @param word mot traité
 * @returns
 */
async function getSyllabsNumber(word) {
    const lexique = await getArray()

    for (const element of lexique) {
        if (element[0] === word.toLocaleLowerCase()) {
            return parseFloat(element[1]);
        }
    }

    return INVALID_WORD;
}

/**
 * Calcule la moyenne du nombre de mots par phrase dans le texte.
 * @param textBrut Le texte brut à analyser.
 * @returns {number} Retoune la moyenne.
 */
export function averageWordsInSentence(textBrut) {
    let nbreWords = getWordsList(textBrut).length;
    let nbreSentences = countSentences(textBrut);

    return nbreWords / nbreSentences;
}

/**
 * récupère tous les mots du fichier
 * @returns {Promise<*[]|string>} tableau de mots contenus dans le texte
 */
async function getArray() {
    // récupère les mots contenus dans le fichier
    // localStorage.removeItem('lexique')

    let lexique = JSON.parse(localStorage.getItem('lexique'));

    // si le fichier ne contient aucun mot, on sort de la fonction
    if (lexique !== null) {
        return lexique;
    }

    const response = await fetch('./data/lexique.csv');
    if (!response.ok) throw new Error('Erreur de chargement du fichier');

    const text = await response.text();

    // Découpe le texte en lignes
    const lines = text.trim().split('\r\n');
    const headers = lines[0].split(';');

    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(';');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            entry[headers[j].trim()] = row[j].trim();
        }

        result.push([entry['word'], entry['syll']]);
    }

    lexique = result;
    localStorage.setItem('lexique', JSON.stringify(lexique));
    return lexique;
}