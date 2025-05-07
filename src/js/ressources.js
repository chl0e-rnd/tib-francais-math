//Déclaration des constantes
const MAX_SYLLABLES = 3;

function cropText(textBrut) {

}

function cleanText(textBrut) {

}

/**
 * Récupère tous les mots d'un texte
 * @param textBrut Le texte brut.
 * @returns {[string]} Retoune une liste de chacun des mots présent dans un texte
 */
export function getWordsList(textBrut) {
    return textBrut.replace(/[^a-zA-Z0-9À-ÿ\s'-]/g, ' ').trim().split(/\s+/)

    // const segmenter = new Intl.Segmenter([], { granularity: 'word' });
    // const segmentedText = segmenter.segment(textBrut);
    // const words = [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);
}


/**
 * Compte le nombre de phrases dans le texte.
 * @param textBrut Le texte brut à analyser.
 * @returns {*|number} Retoune le nombre de phrases dans le texte.
 */
function countSentences(textBrut) {
    let nbreSentences = textBrut.match(/[\.\!\?]+/g);

    return nbreSentences ? nbreSentences.length : 0;
}

/**
 * compte le nombre de mots complexes (plus de 3 syllabes) dans un text
 * @param text texte traité
 * @returns {number} nombre de mots complexes
 */
export function countComplexWords(text) {
    let complexWords = 0; // nombre de mots complexes
    const wordsList = getWordsList(text); // liste de mots dans le texte

    // traite chaque mot du texte
    for (const word of wordsList) {
        // si un mot contient plus de 3 syllabes et que ce n'est pas un nom propre et que ce n'est pas un nom composé, il y a un mot de plus dans le texte
        if (getSyllabsNumber(word) >= MAX_SYLLABLES && !isProperNoun(word) && !word.includes('-')) {
            complexWords++;
        }
    }
    // renvoie le nombre de mot complexe dans le texte
    return complexWords;
}

function isFamilyWord(word) {

}



/**
 *
 * @param textBrut
 * @returns {Promise<{invalidWords: number, syllabs: number}>}
 */
export function averageSyllabsNumber(wordsList) {
    let promises = []

    wordsList.forEach(word => {
        promises.push(getSyllabsNumber(word))
    })
    return Promise.all(promises).then(results => {
        let syllabs = 0;
        let invalidWords = 0;

        results.forEach(result => {
            if (result === -1) {
                invalidWords++;
            } else {
                syllabs += result;
            }
        })

        console.log(syllabs, invalidWords);

        let wordsNumber = wordsList.length - invalidWords;

        return syllabs / wordsNumber;
    })
}

/**
 * renvoie le nombre de syllabes dans un mot
 * @param word mot traité
 * @returns {Promise<void>}
 */
function getSyllabsNumber(word) {
    const lexique = getArray()

    let result = -1;
    return lexique.then((lexique) => {
        let index = lexique.indexOf(word)

        if (index >= 0) {
            result = lexique[index]
            return result;
        }
    })
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
    let lexique = localStorage.getItem('lexique');

    // si le fichier ne contient aucun mot, on sort de la fonction
    if (lexique !== null) {
        return lexique;
    }

    const response = await fetch('./lexicon.csv');
    if (!response.ok) throw new Error('Erreur de chargement du fichier');

    const text = await response.text();

    // Découpe le texte en lignes
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');

    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            entry[headers[j].trim()] = row[j].trim();
        }

        result.push([entry['word'], entry['syll']]);
    }

    console.log('Tableau 2D :', result);

    lexique = result;
    localStorage.setItem('lexique', lexique);
    return lexique;
}

/**
 * Vérifie si le mot est un nom propre.
 * @param word Le mot à vérifier.
 * @returns {boolean} Retourne vrai si c'est un nom propre, faux sinon.
 */
function isProperNoun(word) {
    return getArray().then(array => {
        return !array.includes(word);
    });
}
