import {
  parseSheet,
  shuffle
} from "https://designstem.github.io/fachwerk/fachwerk.js";

const { default: compositionApi, ref } = window.vueCompositionApi;

Vue.use(window.vue2Hammer.VueHammer);
Vue.use(compositionApi);

new Vue({
  setup() {
    const words = ref([]);
    const currentWord = ref(0);
    const reverse = ref(false);

    const genderColors = ["royalblue", "pink", "mediumseagreen"];
    const genderWords = ["der", "die", "das"];

    const id = "17ILBrJ1FxvozYhI31hwCugQnL1c48w6jOxHaQmDb9SA";

    fetch(
      `https://spreadsheets.google.com/feeds/list/${id}/od6/public/values?alt=json`
    )
      .then(res => res.json())
      .then(res => {
        words.value = shuffle(parseSheet(res));
      });

    const onNextWord = () => {
      if (currentWord.value < words.value.length - 1) {
        currentWord.value++;
      } else {
        currentWord.value = 0;
      }
    };

    const onPrevWord = () => {
      if (currentWord.value > 1) {
        currentWord.value--;
      }
    };

    return {
      genderColors,
      genderWords,
      words,
      currentWord,
      onNextWord,
      onPrevWord,
      reverse
    };
  },
  template: `
  <div
    v-if="words.length" 
    style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    "
    :style="{color: genderColors[words[currentWord].gender]}"
  >

    <div
      v-if="words.length"
      v-hammer:swipe.left="onPrevWord"
      v-hammer:swipe.right="onNextWord"
      @mouseup="onNextWord"
        
    > 
      <div>
        {{ reverse ? words[currentWord].estonian : words[currentWord].german }}
      </div>
    </div>

    <div
      v-if="words[currentWord].gender && !reverse"
      style="
        position: fixed;
        top: 20vw;
        padding: 15px;
        font-size: 3vw;
      "
    >
      <div>{{ genderWords[words[currentWord].gender] }}</div>
    </div>

    <div
      style="
        position: fixed;
        right: 0;
        bottom: 0;
        padding: 15px;
        font-size: 1.5rem;
        opacity: 0.3;
        color: white;
      "
      @click="reverse = !reverse"
    >↻
    </div>

  </div>
  `
}).$mount("#app");
