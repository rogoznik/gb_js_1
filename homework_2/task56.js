/*
5. Реализовать основные 4 арифметические операции в виде функций с двумя параметрами. 
Обязательно использовать оператор return.

6. Реализовать функцию с тремя параметрами: function mathOperation(arg1, arg2, operation), 
где arg1, arg2 – значения аргументов, operation – строка с названием операции. 
В зависимости от переданного значения операции выполнить одну из арифметических 
операций (использовать функции из пункта 5) и вернуть полученное значение (использовать switch).
*/

function plus(a, b) {
    return a + b;
}

function minus(a, b) {
    return a - b;
}

function mult(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}

function mathOperation(arg1, arg2, operation) {
    switch (operation) {
        case "+": {
            return plus(arg1, arg2);
        }
        case "-": {
            return minus(arg1, arg2);
        }
        case "*": {
            return mult(arg1, arg2);
        }
        case "/": {
            return div(arg1, arg2);
        }
    }
}

const a = Number(prompt('Введите a'));
const b = Number(prompt('Введите b'));
const oper = prompt('Введите операцию(знаком)');

alert("Результат: " + mathOperation(a, b, oper));
