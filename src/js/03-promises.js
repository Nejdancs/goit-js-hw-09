import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.form'),
  submitBtn: document.querySelector('button[type="submit"]'),
};

const timeoutAlert = 3000;

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  refs.submitBtn.disabled = true;

  createPromises(e);
}

function createPromises({ target: { delay, step, amount } }) {
  let delayVal = Number(delay.value);
  const stepVal = Number(step.value);
  const amountVal = Number(amount.value);

  for (let i = 1; i <= amountVal; i += 1, delayVal += stepVal) {
    if (i === amountVal) {
      UnlockBtn(delayVal);
    }

    createPromise(i, delayVal)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`, {
          timeout: timeoutAlert,
        });
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`, {
          timeout: timeoutAlert,
        });
      });
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function UnlockBtn(delay) {
  setTimeout(() => {
    refs.submitBtn.disabled = false;
  }, delay + timeoutAlert);
}
