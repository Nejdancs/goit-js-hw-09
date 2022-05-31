import { Notify } from 'notiflix/build/notiflix-notify-aio';

const ref = {
  form: document.querySelector('.form'),
};

ref.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const {
    target: { delay, step, amount },
  } = e;

  let delayVal = Number(delay.value);
  const stepVal = Number(step.value);
  const amountVal = Number(amount.value);

  for (let i = 1; i <= amountVal; i += 1, delayVal += stepVal) {
    createPromise(i, delayVal)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
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
