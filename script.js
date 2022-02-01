'use strict'

const input = document.querySelector('.input');
const equal = document.querySelector('.equal');
const clearAll = document.querySelector('.clear');
const numbers = document.querySelectorAll('.numbers div');
const operators = document.querySelectorAll('.operators div');
const deleteSymbol = document.querySelector('.delete');

let isResultDisplayed = false; // для проверки, отображается ли результат(псоле нажатия равно)


numbers.forEach((item) => {
   item.addEventListener('click', (e) => {
      // сохраняем текущую входную строку и ее последний символ 
      const lastChar = input.innerHTML[input.innerHTML.length - 1];

      //проверяем послдений символ на оператор
      let isLastCharOperator = false;
      isLastCharOperator = Array.from(operators).map((item) => item = item.innerHTML).includes(lastChar);

      // если результат не отображается, просто добавляем дальше числа или операции, смотря что нажато
      if (!isResultDisplayed) {
         input.innerHTML += e.target.innerHTML;
      } else if (isResultDisplayed && isLastCharOperator) {
         // если отображается результат и был нажат оператор, то к существующему результату надо добавить оператор
         isResultDisplayed = false;
         input.innerHTML += e.target.innerHTML;
      } else {
         // если результат отображается и было нажато число, очищаем строку ввода и новая операция
         isResultDisplayed = false;
         input.innerHTML = e.target.innerHTML;
      }
   })
});

operators.forEach((item) => {
   item.addEventListener('click', (e) => {
      // сохраняем текущую входную строку и ее последний символ 
      const currentString = input.innerHTML;
      const lastChar = currentString[currentString.length - 1];

      //проверяем последний символ на оператор
      let isLastCharOperator = false;
      isLastCharOperator = Array.from(operators).map((item) => item.innerHTML).includes(lastChar);

      // если последний символ в строке оператор, меняем его на нажатый только что
      if (isLastCharOperator) {
         input.innerHTML = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      } else if (currentString.length === 0) {
         // если строка пустая, ничего не делать)
         console.log("Введите сперва число");
      } else {
         // в других случаях, просто добавим этот оператор в строку
         input.innerHTML += e.target.innerHTML;
      }
   });
});

//очистка всего инпута на кнопку "C"
clearAll.addEventListener("click", () => {
   input.innerHTML = "";
});

deleteSymbol.addEventListener("click", () => {
   //если результат отображается и он не числовой и последний символ не оператор, при нажатии удаляется весь результат(если NaN Infinity)
   const lastChar = input.innerHTML[input.innerHTML.length - 1];
   let isLastCharOperator = false;
   isLastCharOperator = Array.from(operators).map((item) => item.innerHTML).includes(lastChar);
   if (isResultDisplayed && !isFinite(input.innerHTML) && !isLastCharOperator) {
      input.innerHTML = '';
   }
   input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length - 1);
});

equal.addEventListener("click", () => {
   // при нажатии на равно надо получить введенное выражение, выделить два массива, один с числами, другой с операторами
   const inputString = input.innerHTML;
   let numbers = inputString.split(/\+|\-|\×|\÷/g);
   let operators = inputString.replace(/[0-9]|\./g, "").split("");

   console.log(inputString);
   console.log(operators);
   console.log(numbers);

   //ищем индекс данного оператора в строке, с помощью splice удаляем из массива чисел 2 числа, начиная с позиции, на которой стоял оператор, и заменяем удаленные два числа их произведением
   //потом удаляем оператор с массива всех операторов, по индексу,  и снова ищем индекс этого оператора в новом массиве операторов, без предыдущего оператора найденного
   //порядок циклов важен, сперва деление,потом умножение,разность  и сложение
   //цикл нужен для совершения всхе вычисений с этим оператором
   let divide = operators.indexOf("÷");
   while (divide != -1) {
      numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
      operators.splice(divide, 1);
      divide = operators.indexOf("÷");
   }

   let multiply = operators.indexOf("×");
   while (multiply != -1) {
      numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
      operators.splice(multiply, 1);
      multiply = operators.indexOf("×");
   }

   let minus = operators.indexOf("-");
   while (minus != -1) {
      numbers.splice(minus, 2, numbers[minus] - numbers[minus + 1]);
      operators.splice(minus, 1);
      minus = operators.indexOf("-");
   }

   let plus = operators.indexOf("+");
   while (plus != -1) {
      // функция parseFloat принимает строку и возвращает число с плавающей точкой, просто + поствить было нельзя
      numbers.splice(plus, 2, parseFloat(numbers[plus]) + parseFloat(numbers[plus + 1]));
      operators.splice(plus, 1);
      plus = operators.indexOf("+");
   }

   // в итоге в массиве останется одно число,результат, его и выведем в инпут
   input.innerHTML = numbers[0];

   // нужно для корректной работы последующих нажатий в калькуляторе
   isResultDisplayed = true;
});

