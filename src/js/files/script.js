// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

const inputs = document.querySelectorAll('.calculator__fields-input');
const resultButton = document.getElementById('resultButton');


inputs.forEach(input => {
   input.addEventListener('blur', () => {
      const field = input.closest('.calculator__field');
      const addon = field?.querySelector('.calculator__fields-addon');
      const textError = field?.querySelector('.calculator__fields-error');

      if (input.value.trim() === '') {
         input.classList.add('error');
         if (addon) addon.classList.add('error');
         if (textError) textError.innerHTML = 'This field is required';
      } else {
         input.classList.remove('error');
         if (addon) addon.classList.remove('error');
         if (textError) textError.innerHTML = '';
      }
   });
});

const clearForm = (() => {
   const clearButton = document.getElementById('clearForm');

   if (clearButton) {
      clearButton.addEventListener('click', (() => {
         inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');

            const field = input.closest('.calculator__field');
            const addon = field?.querySelector('.calculator__fields-addon');
            const textError = field?.querySelector('.calculator__fields-error');
            const radioInputs = document.querySelectorAll('.calculator__radio-input');
            const content = document.querySelector('.calculator__content');
            const empty = document.querySelector('.calculator__empty');

            radioInputs.forEach(radio => {
               radio.checked = false;
            })

            if (addon) addon.classList.remove('error');
            if (textError) textError.innerHTML = '';
            content.style.display = 'none';
            empty.style.display = 'block'
         })
      }))
   }
})

clearForm()

document.addEventListener('DOMContentLoaded', () => {
   const resultButton = document.getElementById('resultButton');

   resultButton.addEventListener('click', (event) => {
      event.preventDefault();

      const selectedRadio = document.querySelector('input[name="rateType"]:checked');
      const fields = document.querySelectorAll('.calculator__field');
      const radioError = document.querySelector('.calculator__radio .calculator__fields-error');

      if (!selectedRadio) {
         if (radioError) radioError.innerHTML = 'This field is required';
      } else {
         if (radioError) radioError.innerHTML = '';
      }

      fields.forEach(field => {
         const input = field.querySelector('input');
         const addon = field.querySelector('.calculator__fields-addon');
         const textError = field.querySelector('.calculator__fields-error');

         if (input && input.value === '') {
            field.classList.add('error');
            if (addon) addon.classList.add('error');
            if (textError) textError.innerHTML = 'This field is required';
         } else {
            field.classList.remove('error');
            if (addon) addon.classList.remove('error');
            if (textError) textError.innerHTML = '';
         }
      });
   });
});

function calculateMortgage() {
   const amount = parseFloat(document.getElementById('amount').value);
   const rateValue = parseFloat(document.getElementById('rate').value);
   const termValue = parseInt(document.getElementById('term').value, 10);
   const repaymentRadio = document.getElementById('repayment').checked;
   const interestRadio = document.getElementById('interest').checked;
   const monthlePayText = document.getElementById('monthly-pay');
   const totalPayText = document.getElementById('total-pay');
   const content = document.querySelector('.calculator__content');
   const empty = document.querySelector('.calculator__empty');

   if (isNaN(amount) || isNaN(rateValue) || isNaN(termValue) || amount <= 0 || rateValue <= 0 || termValue <= 0) {
      console.error('Будь ласка, введіть коректні числові значення.');
      return;
   }

   const rate = rateValue / 100 / 12;
   const term = termValue * 12;

   let monthlyPayment = 0;
   let totalPayment = 0;

   if (repaymentRadio) {
      monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
      totalPayment = monthlyPayment * term;
      content.style.display = 'flex';
      empty.style.display = 'none';
   }
   else if (interestRadio) {
      monthlyPayment = amount * rate;
      totalPayment = (monthlyPayment * term) + amount;
      content.style.display = 'flex';
      empty.style.display = 'none';
   }

   monthlePayText.innerText = monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
   totalPayText.innerText = totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

   console.log('Monthly Payment:', monthlyPayment.toFixed(2));
   console.log('Total Payment:', totalPayment.toFixed(2));


}

document.getElementById('resultButton').addEventListener('click', calculateMortgage);


document.querySelectorAll('.calculator__radio-body').forEach(radio => {
   radio.addEventListener('click', () => {
      document.querySelectorAll('.calculator__radio-input').forEach(radioInput => {
         radioInput.checked = false;
      });
      const radioInput = radio.querySelector('.calculator__radio-input');
      if (radioInput) {
         radioInput.checked = true;
      }
   });
});
