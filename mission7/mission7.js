var todosCount = 0;
var ul = document.getElementById('todo-list');
var todosCounterLeft = document.getElementById('todos-counter');
var clearCompletedButton = document.getElementById('clear-completed');
var checkAllBox = document.getElementById('check-all');
var checkBoxNumber = 0;
var items = [];
var itemsChecked = [];
checkAllBox.addEventListener('click', checkAll);
clearCompletedButton.addEventListener('click', deleteTodosByCheckboxs);

window.onload = function() {
    if (window.localStorage) {
        for (var i = 0; i < localStorage.itemsChecked.length; i++) {
            itemsChecked[i] = localStorage.itemsChecked[i];
        }
        var temp = "";
        var itemsCount = 0;
        for (var i = 0; i < localStorage.items.length; i++) {
            if (localStorage.items[i] === '|') {
                items[itemsCount] = temp;
                itemsCount++;
                temp = "";
                continue;
            } else {
                temp += localStorage.items[i];
            }
        }
        for (var i = 0; i < items.length; i++) {
            document.getElementById('new-todo').value = items[i];
            addTodos();
        }
        var checkBox = document.getElementsByName('check-box');
        for (var i = 0; i < checkBox.length; i++) {
            if (itemsChecked[i] === '1') {
                checkBox[i].click();
            }
        }
    }
}

document.onkeydown = function(moz_ev) {
    var ev = null;
    if (window.event) {
        ev = window.event;
    } else {
        ev = moz_ev;
    }
    if (ev !== null && ev.keyCode === 13) {
        addTodos();
    }
}

function addTodos() {
    var todoValue = document.getElementById('new-todo').value;
    if (todoValue) {
        var li = document.createElement('li');
        var div = document.createElement('div');
        var input = document.createElement('input');
        var label = document.createElement('label');
        var a = document.createElement('a');
        if (!todosCount) {
            document.getElementById('main').style.display = "block";
            document.getElementById('footer').style.display = "block";
        }
        ul.appendChild(li);
        li.appendChild(div);
        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(a);
        div.className = 'view';
        a.className = 'destroy';
        a.name = 'destroy';
        input.name = 'check-box';
        label.name = 'list-content';
        input.onclick = whetherShowCompletedBoxAndControlBoxsLogic;
        a.onclick = deleteTodosByClick;
        input.setAttribute('type', 'checkbox');
        items[todosCount] = todoValue;
        label.innerHTML = todoValue;
        document.getElementById('new-todo').value = "";
        todosCount++;
    }
    whetherShowCompletedBoxAndControlBoxsLogic();
}

function deleteTodosByClick() {
    this.parentNode.parentNode.remove();
    todosCount--;
    if (!todosCount) {
        document.getElementById('main').style.display = "none";
        document.getElementById('footer').style.display = "none";
    }
    whetherShowCompletedBoxAndControlBoxsLogic();
}

function checkAll() {
    var checkBox = document.getElementsByName('check-box');
    if (checkAllBox.checked) {
        for (var i = 0; i < checkBox.length; i++) {
            if (!checkBox[i].checked) {
                checkBox[i].click();
            }
        }
    } else {
        for (var i = 0; i < checkBox.length; i++) {
            if (checkBox[i].checked) {
                checkBox[i].click();
            }
        }
    }
    whetherShowCompletedBoxAndControlBoxsLogic();
}

function whetherShowCompletedBoxAndControlBoxsLogic() {
    var checkBox = document.getElementsByName('check-box');
    var atleastOneCheckBoxChecked = false;
    var numberOfCheckBox = 0;
    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            checkBox[i].parentNode.style.color = "#777";
            checkBox[i].parentNode.style.textDecoration = "line-through";
            atleastOneCheckBoxChecked = true;
            numberOfCheckBox++;
        } else {
            checkBox[i].parentNode.style.color = "#000";
            checkBox[i].parentNode.style.textDecoration = "none";
        }
    }
    if (atleastOneCheckBoxChecked) {
        document.getElementById('todos-counting').innerHTML = numberOfCheckBox;
        clearCompletedButton.style.display = "block";
    } else {
        clearCompletedButton.style.display = "none";
    }
    if (checkBoxNumber === checkBox.length && checkBoxNumber - numberOfCheckBox === 1) {
        checkAllBox.removeEventListener('click', checkAll);
        checkAllBox.click();
        checkAllBox.addEventListener('click', checkAll);
    }
    if (numberOfCheckBox === checkBox.length && !checkAllBox.checked) {
        checkAllBox.removeEventListener('click', checkAll);
        checkAllBox.click();
        checkAllBox.addEventListener('click', checkAll);
    }
    if (numberOfCheckBox === 0 && checkAllBox.checked) {
        checkAllBox.removeEventListener('click', checkAll);
        checkAllBox.click();
        checkAllBox.addEventListener('click', checkAll);
    }
    checkBoxNumber = numberOfCheckBox;
    todosCounterLeft.innerHTML = checkBox.length - checkBoxNumber;
    setLocalStorage();
}

function deleteTodosByCheckboxs() {
    var checkBox = document.getElementsByName('check-box');
    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            checkBox[i].parentNode.parentNode.remove();
            todosCount--;
            i--;
        }
    }
    if (checkAllBox.checked) {
        checkAllBox.click();
    }
    if (!todosCount) {
        document.getElementById('main').style.display = "none";
        document.getElementById('footer').style.display = "none";
    }
    whetherShowCompletedBoxAndControlBoxsLogic();
}

function setLocalStorage() {
    var checkBox = document.getElementsByName('check-box');
    if (window.localStorage) {
        localStorage.items = "";
        localStorage.itemsChecked = "";
        for (var i = 0; i < checkBox.length; i++) {
            localStorage.items += items[i] + "|";
            if (checkBox[i].checked) {
                localStorage.itemsChecked += "1";
            } else {
                localStorage.itemsChecked += "0";
            }
        }
    }
}
