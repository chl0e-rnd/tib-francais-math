<script setup>
import {computed, ref} from "vue";
import {TextAnalyzer} from "@/js/textAnalyzer.js";

// Déclaration des variables
const text = ref('')
const gunningResult = ref('')
const fryResult = ref({x: '', y: ''})
const posX = ref(0)
const posY = ref(0)
const showPoint = ref(false)

/**
 * Calculer la lisibilité du texte avec les deux algorithmes
 */
function calculateLegibilityText() {

  // Vérification de la présence de texte
  if (text.value === '') {
    alert('Veuillez entrer un texte avant de calculer la lisibilité.')
    return
  }

  // Création d'un analyseur de texte
  const textAnalyzer = new TextAnalyzer(text.value)

  // Récupère l'indice de Gunning et utilise uniquement les deux premiers chiffres après la virgule
  gunningResult.value = textAnalyzer.getGunning().toFixed(2)

  // Récupère l'indice de Fry et utilise uniquement les deux premiers chiffres après la virgule
  let fry = textAnalyzer.getFry()
  fryResult.value = {x: fry.x.toFixed(2), y: fry.y.toFixed(2)}

  // Met à jour le point sur le graphique de Fry
  setPointCoordinates(fryResult.value.x, fryResult.value.y);

}

/**
 * Change les coordonnées reçues pour les faire correspondre à l'image
 * @param x Valeur de l'axe X
 * @param y Valeur de l'axe Y
 */
function setPointCoordinates(x, y) {
  // Si y est plus petit que 10 alors linéaire
  if (y <= 10) {
    posY.value = 287 - ((y - 2) * 27.125)
  } else {
    posY.value = 45
  }

  // Ajout de la position sur l'axe X
  posX.value = 55 + ((x - 108) * 6.48)

  // Affiche le point
  showPoint.value = true;
}

// Position du point sur le graphique
const divPosition = computed(() => {
  return {
    left: `${posX.value}px`,
    top: `${posY.value}px`,
  };
})

</script>

<template>
  <header>
    <h1>TIB - Math Français</h1>


    <div class="content">
      <div class="input-text">
        <p>Entrer un texte dans le champ ci-dessous :</p>
        <!-- text d'entrée pour commencer le traitement -->
        <textarea v-model="text"></textarea>
        <!-- bouton pour enclencher le calcul -->
        <button @click="calculateLegibilityText">Calculer</button>
      </div>

      <div class="result-area">
        <h2>Résultats</h2>
        <div>
          <div class="gunning">
            <h3>Algorithme de Gunning</h3>
            <p>{{ gunningResult || '-' }}</p>
          </div>
          <div class="fry">
            <h3>Algorithme de Fry</h3>
            <p>x : {{ fryResult.x || '-'}}</p>
            <p>y : {{ fryResult.y || '-'}}</p>
            <div class="graph">
              <div class="point" :style="divPosition" v-if="showPoint"></div>
              <img src="@/assets/fry-graph-formula.png" alt="Graphique de fry"></div>
          </div>
        </div>
      </div>

    </div>
  </header>

  <main>
  </main>
</template>

<style scoped lang="scss">

h1 {
  text-align: start;
}

div.content {
  width: 80%;
  margin-top: 30px;
  display: flex;
  justify-content: start;
  flex-direction: row;

  div.input-text {
    display: flex;
    flex-direction: column;
    margin-right: 35px;

    p {
      margin-bottom: 10px;
    }

    textarea {
      height: 300px;
      width: 300px;
      box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
      border: 0;
      padding: 10px;
      border-radius: 5px;
    }

    button {
      margin-top: 25px;
      color: var(--white);
      background-color: var(--primary);

      &:hover {
        background-color: var(--white);
        border: 1px solid var(--primary);
        color: var(--primary);
        font-weight: bold;
        transition: all 0.3s ease;
      }
    }
  }

  div.result-area {
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      text-align: center;
      margin-top: 10px;
      font-style: italic;

      div.gunning {
        margin-right: 25px;
        min-width: 200px;
      }

      div.fry {
        .point {
          position: relative;
          color: red;
          font-weight: bold;
          bottom: 0;
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 100px;
          font-size: 50px;
        }

        img {
          width: 500px;
        }
      }
    }

  }
}


</style>
