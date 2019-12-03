const lang = "de";
const voiceIndex = 1;

const getVoices = () => {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

const chooseVoice = async index => {
  const voices = (await getVoices()).filter(voice => voice.lang == lang);
  return new Promise(resolve => {
    resolve(voices[index]);
  });
};

export const speak = async text => {
  if (!speechSynthesis) {
    return;
  }
  const message = new SpeechSynthesisUtterance(text);
  message.voice = await chooseVoice(voiceIndex);
  speechSynthesis.speak(message);
};
