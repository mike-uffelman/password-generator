'use strict';


import * as helper from './helpers.js';
export let passStore = []; //storage array for generated passwords

// objet for each generated password
class Password {
    testparam = 'this is a test param';
    _id = Date.now();
    constructor(pw) {
        this.pw = pw;
    };

};

// build pw alorithm
// mdn states that Math.random isn't a viable option for secure environments as it is a pseudo randomizer, so here I'm using crypto.getRandomValues as it is considered a better option for randomizing
export const buildPw = function (pwConditions) {
    try {
        const { pwLength, digits, lowerAz, upperAz, specialChars, specialCharsOption,  scOptionChars} = pwConditions;
        let pwDraftArray = [], scrubbedChars;
        const arr = new Uint8Array(1); 
        const specCharList = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126]

        // replace html safe characters with symbols
        if(specialCharsOption) {
            scrubbedChars = helper.htmlEntityRefToChar(scOptionChars?.toString())
            .split(',')
            .map(sc => sc.charCodeAt());

        }

        // while the generated pwlength is less than the desired pwLength continue looping
        while(pwDraftArray.length < pwLength) {
            // let a = new Uint8Array(1);
            const roll = (crypto.getRandomValues(arr) % 4) + 1;
            const randValue = crypto.getRandomValues(arr);

            // based on generated roll, execute the matching switch case and push to pwDraftArray
            // if the character type is false, break and re-roll
            switch(roll) {
                case 1:
                    if(!lowerAz) break;
                    pwDraftArray.push((randValue % 26) + 97);
                    break;
                case 2:
                    if(!upperAz) break;
                    pwDraftArray.push((randValue % 26) + 65);
                    break;
                case 3:
                    if(!specialChars) break;
                    const val = randValue;
                    
                    // use the user defined special characters if the scOptionsChars is defined
                    if(scOptionChars) val.map(v => pwDraftArray.push(scrubbedChars[v % scrubbedChars.length]));
                    
                    // otherwise use the default characters from specCharList
                    if(scOptionChars === undefined) val.map(v => pwDraftArray.push(specCharList[v % 32]));
                    break;
                case 4:
                    if(!digits) break;                    
                    pwDraftArray.push((randValue % 10) + 48);
                    break;
                default:
                    break;
            };
        };
        
        //get character from code value
        const pwArray = pwDraftArray.map(pw => String.fromCharCode(pw));

        //validate password character requirements
        let pwPending = pwValidation(pwArray, pwConditions);

        //if failed validation (i.e. pending) - rebuild
        if(pwPending) {
            buildPw(pwConditions);
        } 
        //if passed validation (i.e. not pending) - shuffle and continue
        if(!pwPending) {
            const shuffled = shufflePwArray(pwArray);
            addToStore(shuffled);
        }
    } catch(err) {
        // console.log('oh no something went wrong', err);
        throw Error(err.message);
    };
};

// create password instance and add validated and shuffled password to the temporary storage array
const addToStore = function(arr) {
    try {
        const newPw = new Password(helper.charToHtmlEntityRef(arr.join('')));
        passStore.push(newPw);
    } catch(err) {
        throw new Error('Failed to add password to temporary storage. Please try again.', err);
    }
    
}


// fisher yates shuffle - takes a random index and pushes to the back of array until all values moved
const shufflePwArray = function(arr) {
    try {
        let currentIndex = arr.length, tempValue, randIndex;
        
        while(0 !== currentIndex) {
            randIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            tempValue = arr[currentIndex];
            arr[currentIndex] = arr[randIndex];
            arr[randIndex] = tempValue;
        }
        //return shuffled array      
        return arr;
    } catch(err) {
        console.log('unable to shuffle password', err);
        throw new Error('Failed to shuffle password', err);
    };
    
};

// password validation function - using RegEx, checking to ensure that the generated password contains at least on of the specificed character types, returns boolean pending
const pwValidation = function(pwArray, pwConditions) {
    try {
        const { pwLength, digits, lowerAz, upperAz, specialChars} = pwConditions;

        // positive look ahead for any non line ending character inside the brackets, requires just 1 match
        const digits09 = '(?=.*[0-9]){1,}';
        const lower = '(?=.*[a-z]){1,}';
        const upper = '(?=.*[A-Z]){1,}';
        const specChars = '(?=.*[!"#$%&\')(*+,-./:;<=>?@[\\]^_`{|}~]){1,}';
      
        const re =  new RegExp(`${ digits ? digits09 : ''}${lowerAz ? lower : ''}${upperAz ? upper : ''}${specialChars ? specChars : ''}.{${pwLength},}`);
    
        //using test() to return boolean, match() returns the index value that matches
        if(!re.test(pwArray.join(''))) return true;
        return false;
    } catch(err) {
        throw new Error('Failed to validate password character requirements.', err);
    }
    

};

