const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

let intId;

refs.startBtn.addEventListener('click', onStartBtn);
refs.stopBtn.addEventListener('click', onStopBtn);

function onStartBtn(e) {
  intId = setInterval(bodyChangeColor, 1000);

  e.currentTarget.disabled = true;
  refs.stopBtn.disabled = false;
}

function onStopBtn(e) {
  clearInterval(intId);

  e.currentTarget.disabled = true;
  refs.startBtn.disabled = false;
}

function bodyChangeColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
