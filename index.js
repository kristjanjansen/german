import {
  parseSheet,
  shuffle
} from "https://designstem.github.io/fachwerk/fachwerk.js";

const { default: compositionApi, ref, computed } = window.vueCompositionApi;
Vue.use(compositionApi);

const { VueHammer } = window.vue2Hammer;
Vue.use(VueHammer);

new Vue({
  setup() {
    const words = ref([]);
    const currentWordIndex = ref(0);
    const reverse = ref(false);

    const genderColors = {
      der: "royalblue",
      die: "pink",
      das: "mediumseagreen"
    };

    const id = "17ILBrJ1FxvozYhI31hwCugQnL1c48w6jOxHaQmDb9SA";

    fetch(
      `https://spreadsheets.google.com/feeds/list/${id}/od6/public/values?alt=json`
    )
      .then(res => res.json())
      .then(res => {
        words.value = shuffle(parseSheet(res));
      });

    const wordsLoaded = computed(() => !!words.value.length);

    const currentWord = computed(() => {
      if (wordsLoaded.value) {
        return reverse.value
          ? words.value[currentWordIndex.value].estonian
          : words.value[currentWordIndex.value].german;
      }
      return "";
    });

    const currentGender = computed(() => {
      if (reverse.value) {
        return "&nbsp";
      }
      if (wordsLoaded.value && words.value[currentWordIndex.value].gender) {
        return words.value[currentWordIndex.value].gender;
      }
      return "&nbsp";
    });

    const currentColor = computed(() => {
      if (
        wordsLoaded.value &&
        words.value[currentWordIndex.value].gender &&
        genderColors[words.value[currentWordIndex.value].gender]
      ) {
        return genderColors[words.value[currentWordIndex.value].gender];
      }
      return "white";
    });

    const onNextWord = () => {
      if (currentWordIndex.value < words.value.length - 1) {
        currentWordIndex.value++;
      } else {
        currentWordIndex.value = 0;
      }
    };

    const onPrevWord = () => {
      if (currentWordIndex.value > 1) {
        currentWordIndex.value--;
      }
    };

    return {
      wordsLoaded,
      currentWord,
      currentGender,
      currentColor,
      onNextWord,
      onPrevWord,
      reverse
    };
  },
  template: `
  <div
    v-if="wordsLoaded" 
    style="
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      border: 2px solid white;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      font-family: Asap Condensed, sans-serif;
      text-transform: uppercase;
      background: hsl(237, 24%, 10%);
      letter-spacing: 0.07em;
      padding: 10vh 0;
    "
    :style="{ color: currentColor }"
  >

    <div
      style="font-size: 4vw;"
      v-html="currentGender"
    />
     
    <div
      v-hammer:swipe.left="onPrevWord"
      v-hammer:swipe.right="onNextWord"
      @mouseup="onNextWord"
      style="font-size: 12vw"
    > 
      {{ currentWord }}
    </div>

    <div
      style="
        font-size: 1.5rem;
        opacity: 0.3;
        color: white;
        padding: 3vw 5vw;
      "
      @click="reverse = !reverse"
    >↻
    </div>

  </div>
  `
}).$mount("#app");
