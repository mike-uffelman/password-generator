/*const charLists = [
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ]*/

const charLists2 = {
    lowerAZ: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    upperAZ: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    specialChars: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
}

/*const chars = document.querySelector('#pw-length').value;
const specChars = document.querySelector('#sc-count').value;
const numbers = document.querySelector('#num-count').value;
*/


class Logic {
    
    static draftStr(pwLength, scCount, numCount) {
        let azLength = pwLength - scCount - numCount;
        let sc = [], num = [], az = [];
        if(pwLength < (scCount + numCount)) {
            pwLength = (scCount + numCount)
        }
        
        for (let i = 0; i < azLength; i++) {
            if(Math.floor(Math.random() * 2) === 1) {
                az.push(charLists2['lowerAZ'][Math.floor(Math.random() * charLists2['lowerAZ'].length)])
            } else {
                az.push(charLists2['lowerAZ'][Math.floor(Math.random() * charLists2['upperAZ'].length)].toUpperCase())
            }
        }
        console.log(az);
        for (let j = 0; j < scCount; j++) {
            sc.push(charLists2['specialChars'][Math.floor(Math.random() * charLists2['specialChars'].length)])
        }
        console.log(sc);
        for (let k = 0; k < numCount; k++) {
            num.push(charLists2['digits'][Math.floor(Math.random() * charLists2['digits'].length)])
        }
        console.log(num);
        console.log(az.concat(sc, num).join(''));
        Logic.shuffle(az.concat(sc, num));
    }
    
    static shuffle(arr) {
        let currentIndex = arr.length;
        let tempValue;
        let randIndex;
        
        while(0 !== currentIndex) {
            
            randIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            tempValue = arr[currentIndex];
            arr[currentIndex] = arr[randIndex];
            arr[randIndex] = tempValue;
        }
        
        UI.printPassword(arr.join(''));
    }
        
}

class UI {
    static displayCounts() {
        
        const pwDisplay = document.querySelector('#pw-display');
        const pwLength = document.querySelector('#pw-length').value;
        pwDisplay.innerText = pwLength;
        
        const scDisplay = document.querySelector('#sc-display');
        const scCount = document.querySelector('#sc-count').value;
        scDisplay.innerText = scCount;
        
        const numDisplay = document.querySelector('#num-display');
        const numCount = document.querySelector('#num-count').value;
        numDisplay.innerText = numCount;
        
        /*if(pwLength < (scCount + numCount)) {
            pwDisplay.innerText = scCount + numCount;
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        } else {
            pwDisplay.innerText = pwLength;
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        }*/
        
    }
    
    static printPassword(finalStr) {
        const section = document.querySelector('section');
        const list = document.querySelector('ul');
        const li = document.createElement('li');
        
        section.classList.add('bg-body');
        
        li.classList.add('list-group-item', 'list-group-item-light', 'new-pass-color', 'bg-transparent');
        
        li.innerHTML = `
            <div class='d-flex justify-content-between'>
                <input id='passwordText' class='visually-hidden' value='${finalStr}'></input>
                <p id='' class='pwItem mb-0 text-break'>${finalStr}</p>
                <img id='copy-icon' src='./images/copy.svg' width=\'15px\' height=\'15px\' class='align-self-center' onclick='UI.copy()'>
            </div>`;
            
        list.prepend(li);
        
        setTimeout(() => {
            li.style.color = '#6c757d';
            li.style.transition = 'color ease 350ms';
        }, 3000)
        
        document.querySelector('#clear-list-button').classList.remove('d-none');
        
    }
    
    static copy(e) {
        const pwText = document.querySelector('#passwordText');
        pwText.select();
        pwText.setSelectionRange(0,9999);
        document.execCommand('copy');
        UI.alert('Password copied!', 'info')
        UI.removeAlert();
    }
    
    //original alert within list section
    /*static alert(message, type) {
        const pwList = document.querySelector('section');
        const div = document.createElement('div');
        div.id = 'alert'
        div.classList = `alert mt-3 alert-${type}`
        div.appendChild(document.createTextNode(`${message}`))
        const ul = document.querySelector('ul');
        pwList.insertBefore(div, ul);
        //inserts below the list items within the list
        pwList.append(div);
        div.style.opacity = '1';
    }*/
    
    static alert(message, type) {
        const pwList = document.querySelector('section');
        const div = document.createElement('div');
        div.id = 'alert'
        div.classList = `alert mt-3 alert-${type}`
        div.appendChild(document.createTextNode(`${message}`))
        const ul = document.querySelector('ul');
        pwList.append(div);
        div.style.opacity = '1';
    }
    
    static removeAlert() {
        setTimeout(() => {
            const div = document.querySelector('#alert');
            div.style.opacity = '0';
            div.style.transition = 'opacity ease-in-out 350ms'
            /*document.querySelector('#alert').remove();*/
        }, 2500);
        
        setTimeout(() => {
            document.querySelector('#alert').remove();
        }, 3000);
    }
    
    static clearList() {
        document.querySelector('ul').innerHTML = '';
        document.querySelector('section').classList.remove('bg-body');
        document.querySelector('#clear-list-button').classList.add('d-none');
    }
    
    
}

  

document.querySelector('form').addEventListener('change', UI.displayCounts)

/*document.querySelector('form').addEventListener('change', (e) => {
        const pwDisplay = document.querySelector('#pw-display');
        const pwLength = document.querySelector('#pw-length').value;
        //pwDisplay.innerText = pwLength;
        
        const scDisplay = document.querySelector('#sc-display');
        const scCount = document.querySelector('#sc-count').value;
        //scDisplay.innerText = scCount;
        
        const numDisplay = document.querySelector('#num-display');
        const numCount = document.querySelector('#num-count').value;
        //numDisplay.innerText = numCount;
        
        if(pwLength < (scCount + numCount)) {
            document.querySelector('#pw-length').value = (scCount + numCount);
            pwDisplay.innerText = document.querySelector('#pw-length').value;
            
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        } else {
            pwDisplay.innerText = pwLength;
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        }
})*/




document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pwLength = document.querySelector('#pw-length').value;
    const scCount = document.querySelector('#sc-count').value;
    const numCount = document.querySelector('#num-count').value;
    
    if(pwLength === '0') {
        UI.alert('Please select password length.', 'danger')
    } else {
        Logic.draftStr(pwLength, scCount, numCount);
        UI.alert('New password created!', 'success');
    }
    
    UI.removeAlert();
    
})


//fun copy password event
/*document.querySelector('ul').addEventListener('copy', (e) => {
    if(e.target.nodeName === 'LI') {
        const selection = document.getSelection();
        e.clipboardData.setData('text/plain', selection.toString());
        e.preventDefault();
        UI.alert('Password copied!', 'info');
        UI.removeAlert();
    }
});*/

document.querySelector('#clear-list-button').addEventListener('click', (e) => {
    UI.clearList();
})

document.querySelector('#copy-icon').addEventListener('click', UI.copy);

/*document.querySelector('ul').addEventListener('click', (e) => {
    
        console.log(e.target.previousElementSibling.innerText);
    
})*/

/*document.querySelector('ul').addEventListener('click', (e) => {
    if(e.target.nodeName === 'IMG') {
        const selection = document.getSelection();
        e.target.previousElementSibling.innerText.clipboardData.setData('text/plain', selection.toString());
        e.preventDefault();
        UI.alert('Password copied!', 'info');
        UI.removeAlert();
    }
});*/

/*document.querySelector('ul').addEventListener('click', (e) => {
    
    if(!pwText) {
        return;
    } else {
        
    }
    }
        
})*/


    /*const pwText = document.getElementById('passwordText');
    const copyIcon = document.getElementById('copy-icon');*/
    
    

    

    /*console.log(e.target.previousElementSibling.previousElementSibling.value);*/
    
    



    