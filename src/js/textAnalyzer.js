import {lexique} from "../../public/data/lexique.js";

const MAX_SYLLABS = 3;

export class TextAnalyzer {
    constructor(text) {
        // Texte fourni par l'utilisateur
        this.text = text

        // Une liste de chacun des mots présent dans un texte
        this.words = Array.from(new Intl.Segmenter("fr", {granularity: 'word'})
            .segment(text))
            .filter(s => s.isWordLike)
            .map(s => s.segment);

        // Le nombre de phrases dans le texte
        this.sentenceCount = Array.from(new Intl.Segmenter("fr", {granularity: 'sentence'})
            .segment(text))
            .map(s => s.segment)
            .length;

        // Nombre total de syllabes présentes dans le texte
        this.syllabsNumber = 0;

        // Nombre de mots invalides dans le texte
        this.invalidWords = 0;

        // Nombre de mots jugés comme complexes (composés de trois syllabes ou plus)
        this.complexWords = 0;

        for (let word of this.words) {
            const syllabsNumber = lexique.get(word)

            if (syllabsNumber === undefined) {
                this.invalidWords++;
            } else {
                this.syllabsNumber += syllabsNumber;

                // si un mot contient plus de 3 syllabes et que ce n'est pas un nom propre et que ce n'est pas un nom composé, il y a un mot de plus dans le texte
                if (syllabsNumber >= MAX_SYLLABS && !word.includes('-'))
                    this.complexWords++;
            }
        }

        this.averageSyllabsNumber = this.syllabsNumber / (this.words.length - this.invalidWords);
    }

    /**
     * Calcule l'indice de lisibilité de Gunning.
     *
     * @returns {number} - L'indice Gunning Fog du texte.
     */
    get gunning() {
        return 0.4 * ((this.words.length / this.sentenceCount) + 100 * (this.complexWords / this.words.length));
    }

    /**
     * Calcul la lisibilité du text passé en paramètre par rapport à l'algorithme de de Fry
     *
     * @returns {number[]} Cordonnées sur le graphique de Fry
     */
    get fry() {
        return [this.averageSyllabsNumber * 100, this.sentenceCount / this.words.length * 100]
    }
}
