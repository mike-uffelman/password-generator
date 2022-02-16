'use strict';


// const hash = require('object-hash');
const crypto = require('crypto');
// const sha1 = require('crypto-js/sha1');
// const CryptoJS = require('crypto-js');
export let pwFinal = '';

export let passStore = [];

class Password {
    _safe;
    _id = Date.now();
    pwHash;
    constructor(pw) {
        this.pw = pw;
        
    }
}


let lowerAZCharsList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let upperAZCharsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
let specialCharsList = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
let digitCharsList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
//az 97-122
//AZ 65-90
//sc 33-47, 91-96, 123-126 
//nums 48-57

export const draftStr = function (pwConditions) {
    try {
        const { pwLength, digits, lowerAz, upperAz, specialChars} = pwConditions;

        let pwArray = [];
    
        while(pwArray.length < pwLength) {
            let roll = Math.floor(Math.random() * 4 + 1)
    
            switch(roll) {
                case 1:
                    if(!lowerAz) break;
                    pwArray.push(lowerAZCharsList[Math.floor(Math.random() * lowerAZCharsList.length)]);
                    break;
                case 2:
                    if(!upperAz) break;
                    pwArray.push(upperAZCharsList[Math.floor(Math.random() * upperAZCharsList.length)]);
                    break;
                case 3:
                    if(!specialChars) break;
                    pwArray.push(specialCharsList[Math.floor(Math.random() * specialCharsList.length)]);
                    break;
                case 4:
                    if(!digits) break;                    
                    pwArray.push(digitCharsList[Math.floor(Math.random() * digitCharsList.length)]);
                    break;
                default:
                    break;
    
            }
        }
                
        console.log(pwArray)
        let pwPending = pwValidation(pwArray, pwConditions);
    
        if(pwPending) {
            console.log('%cpassword failed validation, re-trying...', 'color: red')
            draftStr(pwConditions);
        } else {
            console.log('%cpassword passed validation!!!', 'color: green')
            shuffle(pwArray);
        }
    
        console.log('%cPassword storage array: ', 'color: magenta', passStore);
    } catch(err) {
        console.log('oh no something went wrong', err);
    }
    

    
}

const shuffle = function(arr) {
    // console.log('%cPassword storage array: ', 'color: magenta', passStore);

    try {
        pwFinal = '';
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
        
        const newPw = new Password(arr.join(''));
        passStore.push(newPw);

        pwFinal = arr.join('');

        // console.log('%cPassword storage array: ', 'color: magenta', passStore);

    } catch(err) {
        console.log('unable to shuffle password', err)
    }
    
}

const pwValidation = function(pwArray, pwConditions) {
    const { pwLength, digits, lowerAz, upperAz, specialChars} = pwConditions;
    console.log('password validation check');

    const digits09 = '(?=.*[0-9]){1,}';
    const lower = '(?=.*[a-z]){1,}';
    const upper = '(?=.*[A-Z]){1,}';
    const specChars = '(?=.*[!@#$%^&*()]){1,}';
    let pending;
    
  
    const re =  new RegExp(`${ digits ? digits09 : ''}${lowerAz ? lower : ''}${upperAz ? upper : ''}${specialChars ? specChars : ''}.{${pwLength},}`);

console.log(re);

    console.log(pwArray.join(''));
    if(!re.test(pwArray.join(''))) {
        console.log('%cPassword failed validation', 'color: red')
        pending = true;
        return pending;
    
    } else {
        console.log('%cPassword passed validation', 'color: green')
        pending = false;
        return pending;
    };

}

export const vulnerabilityCheck = async function(item) {
    const pwEl = passStore.find(({_id}) => _id === Number(item))
    pwEl.pwHash = hashPass.call(pwEl, pwEl.pw);
    await checkPass.call(pwEl, pwEl.pwHash);
    if(pwEl._safe) {
        return true;
    } else {
        return false;
    }
}

const hashPass = function(pw) {
    // console.log(pw);
    return crypto.createHash('sha1')
        .update(pw)
        .digest('hex');
}

const checkPass = async function(pwHash) {
    console.log(this);
    const hashPrefix = pwHash.slice(0, 5);
    const hashSuffix = pwHash.slice(5);

    //pwnedpasswords returns API requests as a readable stream
    this._safe = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
        .then(response => {
            return response.body
        })
        .then(rb => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then( ({ done, value }) => {
                            if(done) {
                                console.log('done', done);
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            // console.log(done, value);
                            push();
                        })
                        // console.log(reader);
                    }
                    push();
                }
            });
        })
        .then(stream => {
            return new Response(stream, { headers: { "Content-Type": "text/html"}}).text();
        })
        .then( result => {
            const re = /\r\n|\n|\r/gm;
            // result = result ? utf8Decoder.decode(result, { stream: true }) : '';
            const resultArray = [result.split(re)];
            
            console.log(resultArray);

            return cleanUpChunk(resultArray, hashSuffix);
        })
        .then(check => {
            console.log(check)
            
            if(check) {
                console.log('%cOh no, this password is vulnerable!', 'color: orangered');
                //? update pwObject safe variable
                console.log(this);
                let result = false;
                return result;
            } else {
                console.log('%cPassword is safe to use!', 'color: limegreen');
                console.log(this);
                //? update pwObject safe variable
                let result = true;
                return result;
            }

        })
}

const cleanUpChunk = async function(chunkArray, hashSuffix) {
    const cleanArray = await chunkArray.flat()
            .map(c => c.split('')
            .splice(0, c.indexOf(':'))
            .join('')
            .toLowerCase())
    // console.log(cleanArray, hashSuffix)
    const response = cleanArray.some(item => item === hashSuffix)
    // console.log(result);
    return response;
}
