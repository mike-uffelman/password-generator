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

    constructor(pw) {
        this.pw = pw;
    }
}


let lowerAZ = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let upperAZ = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']



export const draftStr = function (pwLength, scCount, numCount) {
    console.log('draft string: ', pwLength, scCount, numCount)
    // let az = new Array(Number(pwLength));
    let pwArray = [];
    while(pwArray.length < pwLength) {
        let roll = Math.floor(Math.random() * 4 + 1)

        switch(roll) {
            case 1:
                pwArray.push(lowerAZ[Math.floor(Math.random() * lowerAZ.length)]);
                break;
            case 2:
                pwArray.push(upperAZ[Math.floor(Math.random() * upperAZ.length)]);
                break;
            case 3:
                if(!scCount) break;
                pwArray.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
                break;
            case 4:
                if(!numCount) break;                    
                pwArray.push(digits[Math.floor(Math.random() * digits.length)]);
                break;
            default:
                break;

        }
    }
            
    const pwPending = pwValidation(pwArray, pwLength, scCount, numCount);

    if(pwPending) {
        console.log('%cpassword failed validation, re-trying...', 'color: red')
        draftStr(pwLength, scCount, numCount);
    } else {
        console.log('%cpassword passed validation!!!', 'color: green')
    }

    shuffle(pwArray);
}

const shuffle = function(arr) {
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
    } catch(err) {
        console.log('unable to shuffle password', err)
    }
    
}

const pwValidation = function(pwArray, length, sc, nums) {
    console.log('password validation check');

    console.log(pwArray, length, sc, nums);
    const digits = '(?=.*[0-9]){1,}';
    const upLo = '(?=.*[a-z]){1,}(?=.*[A-Z]){1,}';
    const specChars = '(?=.*[!@#$%^&*()]){1,}';
    let pending;
    
  
    const re =  new RegExp(`${nums ? digits : ''}${upLo}${sc ? specChars : ''}.{${length},}`);
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


//! previous algorithm ====================================================
// export const draftStr = function (pwLength, scCount, numCount) {
//     console.log('draft string: ', pwLength, scCount, numCount)
//     let azLength = pwLength - scCount - numCount;
//     let sc = [], num = [], az = [];
//     if(pwLength < (scCount + numCount)) {
//         pwLength = (scCount + numCount)
//     }
    
//     // select a to z characters
//     // for each index, random 0 or 1, if 1 get a random lowercase a-z, else get a random A-Z and push to the az [] array
//     for (let i = 0; i < azLength; i++) {
//         if(Math.floor(Math.random() * 2) === 1) {
//             az.push(charLists2['lowerAZ'][Math.floor(Math.random() * charLists2['lowerAZ'].length)])
//         } else {
//             az.push(charLists2['lowerAZ'][Math.floor(Math.random() * charLists2['upperAZ'].length)].toUpperCase())
//         }
//     }
//     console.log(az);
//     //for each special character count get a random character from the specialChar array and push to sc [] array
//     for (let j = 0; j < scCount; j++) {
//         sc.push(charLists2['specialChars'][Math.floor(Math.random() * charLists2['specialChars'].length)])
//     }
//     console.log(sc);

//     //for each number count get a random character from the specialChar array and push to sc [] array
//     for (let k = 0; k < numCount; k++) {
//         num.push(charLists2['digits'][Math.floor(Math.random() * charLists2['digits'].length)])
//     }
//     console.log(num);
//     console.log(az.concat(sc, num).join(''));

//     // shuffle the az draft string
//     shuffle(az.concat(sc, num));
// }
//!===============================================================================


    
export const vulnerabilityCheck = async function(pw) {
    const pwHash = hashPass(pw);
    checkPass(pwHash);
}

const hashPass = function(pw) {
    return crypto.createHash('sha1')
        .update(pw)
        .digest('hex');
}


const checkPass = async function(pass) {
    const hashPrefix = pass.slice(0, 5);
    const hashSuffix = pass.slice(5);
    console.log('hashPrefix: ', hashPrefix);
    console.log('hashSuffix: ', hashSuffix);

    //pwnedpasswords returns API requests as a readable stream
    fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
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
            })
        })
        .then(stream => {
            return new Response(stream, { headers: { "Content-Type": "text/html"}}).text();
        })
        .then(async result => {
            const re = /\r\n|\n|\r/gm;
            // result = result ? utf8Decoder.decode(result, { stream: true }) : '';
            const resultArray = [result.split(re)]
            
            console.log(resultArray);

            const checkMatch = await cleanUpChunk(resultArray, hashSuffix);
    
            if(checkMatch) {
                console.log('%cOh no, this password is vulnerable!', 'color: magenta');
                this._safe = false;
            } else {
                console.log('no matches...')
                this._safe = true;

            }
            console.log(passStore);


        })



    // let { value: chunk, done: readerDone } = await reader.read();

    // console.log(chunk);

 


    // console.log(chunkArray);
        
    
    // const checkMatch = await cleanUpChunk(chunkArray, hashSuffix);

    
}

//! ===== previous code - works but doesnt return all chunks in the array to check for a match...
// const checkPass = async function(pass) {
//     const hashPrefix = pass.slice(0, 5);
//     const hashSuffix = pass.slice(5);
//     console.log('hashPrefix: ', hashPrefix);
//     console.log('hashSuffix: ', hashSuffix);
    
//     const utf8Decoder = new TextDecoder('utf-8');

//     let response =  await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
//     let reader = await response.body.getReader();
//     let { value: chunk, done: readerDone } = await reader.read();
//     chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : '';

//     console.log(chunk);

//     const re = /\r\n|\n|\r/gm;
 

//     const chunkArray = [chunk.split(re)]

//     console.log(chunkArray);
        
    
//     const checkMatch = await cleanUpChunk(chunkArray, hashSuffix);

//     if(checkMatch) {
//         console.log('we have a match')
//         } else {
//         console.log('no matches...')
//         }
// }
//!======================================================================================

const cleanUpChunk = async function(chunkArray, hashSuffix) {
    const cleanArray = await chunkArray.flat()
            .map(c => c.split('')
            .splice(0, c.indexOf(':'))
            .join('')
            .toLowerCase())
    // console.log(cleanArray, hashSuffix)
    const result = cleanArray.some(item => item === hashSuffix)
    return result;
}
