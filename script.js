'use strict'

const input = document.querySelector('#entryField');
const equal = document.querySelector('#equal');
const clear = document.querySelector('#clear');
const numbers = document.querySelectorAll('.numbers div');
const operators = document.querySelectorAll('.operators div');
const deleteSymbol = document.querySelector('#delete');

let resultDisplayed = false; // для проверки, отображается ли результат(псоле нажатия равно)

for (let i = 0; i < numbers.length; i++) {
   numbers[i].addEventListener('click', function (e) {
      // сохраняем текущую входную строку и ее последний символ 
      let currentString = input.innerHTML;
      let lastChar = currentString[currentString.length - 1];

      //проверяем послдений символ на оператор
      let checkOperators = false;
      for (let i = 0; i < operators.length; i++) {
         if (operators[i].innerHTML.includes(lastChar)) {
            checkOperators = true;
         }
      }

      // если результат не отображается, просто добавляем дальше числа или операции, смотря что нажато
      if (resultDisplayed === false) {
         input.innerHTML += e.target.innerHTML;
      } else if (resultDisplayed && checkOperators) {
         // если отображается результат и был нажат оператор, то к существующему результату надо добавить оператор
         resultDisplayed = false;
         input.innerHTML += e.target.innerHTML;
      } else {
         // если результат отображается и было нажато число, очищаем строку ввода и новая операция
         resultDisplayed = false;
         input.innerHTML = "";
         input.innerHTML += e.target.innerHTML;
      }
   });
}

for (let i = 0; i < operators.length; i++) {
   operators[i].addEventListener("click", function (e) {

      // сохраняем текущую входную строку и ее последний символ 
      let currentString = input.innerHTML;
      let lastChar = currentString[currentString.length - 1];

      //проверяем послдений символ на оператор
      let checkOperators = false;
      for (let i = 0; i < operators.length; i++) {
         if (operators[i].innerHTML.includes(lastChar)) {
            checkOperators = true;
         }
      }

      // если последний символ в строке оператор, меняем его на нажатый только что
      if (checkOperators) {
         let newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
         input.innerHTML = newString;
      } else if (currentString.length == 0) {
         // если строка пустая, ничего не делать)
         console.log("Введите сперва число");
      } else {
         // в других случаях, просто добавим этот оператор в строку
         input.innerHTML += e.target.innerHTML;
      }
   });
}

//очистка всего инпута на кнопку "C"
clear.addEventListener("click", function () {
   input.innerHTML = "";
});

deleteSymbol.addEventListener("click", function () {
   //если результат отображается, при нажатии удаляется весь результат
   if (resultDisplayed) {
      input.innerHTML = '';
   }
   input.innerHTML = input.innerHTML.substring(0, input.innerHTML.length - 1);
});

equal.addEventListener("click", function () {
   // при нажатии на равно надо получить введенное выражение, выделить два массива, один с числами, другой с операторами
   let inputString = input.innerHTML;
   let numbers = inputString.split(/\+|\-|\×|\÷/g);
   let operators = inputString.replace(/[0-9]|\./g, "").split("");

   console.log('Входящая строка:', inputString);
   console.log('Операторы:', operators);
   console.log('Числа:', numbers);

   //если один операнд в инпуте, после него нажат оператор и потом равно, в инпут вернуть просто число
   //без этой проверки инпут "69*" после нажатия на равно показывал 0, с делением - Infinity
   if (numbers[1] === "") {
      input.innerHTML = numbers[0];
      return;
   }

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
   resultDisplayed = true;
});

