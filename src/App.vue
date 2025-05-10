<script setup>
import {computed, ref} from "vue";
import {getFryResult} from "@/js/algo-fry.js";
import {getGunningResult} from "@/js/algo-gunning.js";


//Déclaration des variables
const text = ref('')
const gunningResult = ref('')
const fryResult = ref([])
const posX = ref(0)
const posY = ref(0)

/**
 * Calculer la lisibilité du texte avec les deux algorithmes
 */
function calculateLegibilityText() {

  // Vérification de la présence de texte
  if (text.value === '') {
    alert('Veuillez entrer un texte avant de calculer la lisibilité.')
    return
  }

  // Effectue les algoritmes sur les tests
  getGunningResult(text.value).then((res) => {
    gunningResult.value = res
  })

  //left 55px pour 0, 470px pour fin -> 64 diff | 415 px de long, 415 / 64 = 25,90
  //top 287px pour 0, 17px pour fin -> 11,74
  getFryResult(text.value).then((v) => {
    fryResult.value = v

    setPointCoordonates(v[0], v[1]);
  });
}

/**
 *
 * @param x
 * @param y
 */
function setPointCoordonates(x, y) {
  posX.value = 55 + ((x - 108) * 6.48)
  posY.value = 287 - ((y - 2) * 11.74)
}

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
            <p>{{ fryResult }}</p>
            <div class="graph">
              <div class="point" :style="divPosition"></div>
              <img src="@/assets/fry-graph-formula.png" alt="Graphique image fry"></div>
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
          bottom: 0px;
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
