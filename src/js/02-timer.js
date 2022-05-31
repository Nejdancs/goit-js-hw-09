import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  resetBtn: document.querySelector('[data-reset]'),
  timerDays: document.querySelector('[data-days]'),
  timerHours: document.querySelector('[data-hours]'),
  timerMinutes: document.querySelector('[data-minutes]'),
  timerSeconds: document.querySelector('[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose([selectedDates]) {
    const currentDate = Date.now();

    if (currentDate < selectedDates) {
      refs.startBtn.disabled = false;

      localStorage.setItem(STORAGE_KEY, selectedDates.getTime());

      return;
    }
    refs.startBtn.disabled = true;

    Notify.failure('Please choose a date in the future');
  },
};

const fp = flatpickr('#datetime-picker', options);

let intId;
const STORAGE_KEY = 'selected-date';

refs.startBtn.addEventListener('click', onStartBtn);
refs.resetBtn.addEventListener('click', onResetBtn);

if (localStorage.getItem('isStarted')) {
  onStartBtn();
}

function onStartBtn() {
  startTimer();
  refs.startBtn.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;
  refs.resetBtn.disabled = false;

  localStorage.setItem('isStarted', true);
}

function onResetBtn() {
  refs.startBtn.disabled = true;
  document.querySelector('#datetime-picker').disabled = false;
  refs.resetBtn.disabled = true;

  updateTimer(convertMs(0));
  clearInterval(intId);

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('isStarted');
}

function startTimer() {
  onTick();
  intId = setInterval(onTick, 1000);
}

function onTick() {
  const savedDate = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const selectedDateInMs = savedDate ?? fp.selectedDates[0].getTime();
  const deltaTime = selectedDateInMs - Date.now();
  const leftTime = convertMs(deltaTime);

  if (deltaTime <= 0) {
    clearInterval(intId);
    return;
  }

  updateTimer(leftTime);
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.timerDays.textContent = days;
  refs.timerHours.textContent = hours;
  refs.timerMinutes.textContent = minutes;
  refs.timerSeconds.textContent = seconds;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
