import {lexique} from "@/data/lexique.js";

const COMPLEX_WORD_SYLLABLES_NUMBER = 3;

export class TextAnalyzer {

    // Texte à analyser.
    text = "";

    // Liste des mots contenus dans le texte.
    words = [];

    // Nombre de phrases contenues dans le texte.
    sentencesNumber = 0;

    // Nombre de mots invalides contenus dans le texte (Mots qui ne sont pas présents dans le lexique).
    invalidWords = 0;

    // Nombre de mots complexes contenus dans le texte (Mots de min 3 syllabes), n'inclut pas les noms propres et les mots composés.
    complexWords = 0;

    // Nombre total des syllabes du texte.
    syllablesNumber = 0;

    /**
     * Constructeur de l'analyseur de texte.
     * @param text Texte à analyser.
     */
    constructor(text) {

        this.text = text
        this.words = this.getWords(text)
        this.sentencesNumber = this.getSentencesNumber(text)

        // Compte le nombre de syllabes et les mots complexes.
        for (let word of this.words) {
            const syllablesNumber = lexique.get(word)

            if (syllablesNumber === undefined) {
                // Le mot n'est pas présent dans le lexique, il est donc invalide.
                this.invalidWords++;
            } else {
                this.syllablesNumber += syllablesNumber;

                // Si un mot contient 3 syllabes ou plus et que ce n'est pas un mot composé, c'est un mot complexe.
                if (syllablesNumber >= COMPLEX_WORD_SYLLABLES_NUMBER && !word.includes('-'))
                    this.complexWords++;
            }
        }
    }

    /**
     * Calcule le nombre moyen de syllabes par mot.
     *
     * @returns {number} Retourne le nombre moyen de syllabes par mots.
     */
    getAverageSyllablesNumberPerWord() {
        return this.syllablesNumber / (this.words.length - this.invalidWords);
    }

    /**
     * Crée une liste de tous les mots présents dans le texte donné.
     *
     * @param text Texte duquel extraire les mots.
     * @returns {string[]} Liste des mots extraits.
     */
    getWords(text) {
        return Array.from(new Intl.Segmenter("fr", {granularity: 'word'})
                    .segment(text))
                    .filter(s => s.isWordLike)
                    .map(s => s.segment.toLowerCase());
    }

    /**
     * Récupère le nombre de phrases présentes dans le texte donné.
     *
     * @param text Texte dans lequel compter le nombre de phrases.
     * @returns {number} Nombre de phrases du texte.
     */
    getSentencesNumber(text) {
        return Array.from(new Intl.Segmenter("fr", {granularity: 'sentence'})
                    .segment(text))
                    .map(s => s.segment)
                    .length;
    }

    /**
     * Calcule l'indice de lisibilité de Gunning.
     *
     * @returns {number} Indice Gunning Fog du texte.
     */
    getGunning() {
        return 0.4 * ((this.words.length / this.sentencesNumber) + 100 * (this.complexWords / this.words.length));
    }

    /**
     * Calcule l'indice de lisibilité (Coordonnées x et y) selon l'algorithme de Fry
     *
     * @returns {{x: number, y: number}} Cordonnées x et y sur le graphique de Fry
     */
    getFry() {
        return {x: this.getAverageSyllablesNumberPerWord() * 100, y: this.sentencesNumber / this.words.length * 100}
    }
}
