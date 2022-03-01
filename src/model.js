'use strict';


const crypto = require('crypto');
export let passStore = []; //store generated passwords

// objet for each generated password
class Password {
    _safe;
    _id = Date.now();
    pwHash;
    constructor(pw) {
        this.pw = pw;
        
    };
};

// build pw alorithm
// mdn states that Math.random isn't a viable option for secure environments as it is a pseudo randomizer, so here I'm using crypto.getRandomValues as it is considered a better option for randomizing
export const buildPw = function (pwConditions) {
    try {
        const { pwLength, digits, lowerAz, upperAz, specialChars, scOptionChars} = pwConditions;
        let pwDraftArray = [];
        const arr = new Uint8Array(1);
        const specCharList = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126]
        scOptionChars

        console.log(scOptionChars)

        // replace html safe characters with symbols
        const scrubbedChars = scOptionChars?.toString()
            .replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#39;', "'")
            .replaceAll('&#92;', '\\')

            .split(',')
            .map(sc => sc.charCodeAt());

        console.log(scrubbedChars);

        //-----------------------
        // while the generated pwlength is less than the desired pwLength continue looping
        while(pwDraftArray.length < pwLength) {
            // let a = new Uint8Array(1);
            const roll = (self.crypto.getRandomValues(arr) % 4) + 1;
            const randValue = self.crypto.getRandomValues(arr);

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
        
        console.log(pwDraftArray);

        //get character from code value
        const pwArray = pwDraftArray.map(pw => String.fromCharCode(pw));

        //validate password character requirements
        let pwPending = pwValidation(pwArray, pwConditions);

        //if failed validation (i.e. pending) - rebuild
        pwPending && buildPw(pwConditions);
        //if passed validation (i.e. not pending) - shuffle and continue
        !pwPending && shufflePwArray(pwArray);

         
    } catch(err) {
        console.log('oh no something went wrong', err);
        throw new Error('An error has occured...', err);
    };
    

    
};

// fisher yates shuffle - takes a random index and pushes to the back of array until all values moved
const shufflePwArray = function(arr) {
    try {
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
        
        // create new Password object and push to passStore, prior to storing we convert vulnerable characters back to html number codes
        const newPw = new Password(arr.join('').replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
        .replaceAll('\\', '&#92;'));
        passStore.push(newPw);
        console.log(passStore);

    } catch(err) {
        console.log('unable to shuffle password', err);
    };
    
};

// password validation function - using RegEx, checking to ensure that the generated password contains at least on of the specificed character types, returns boolean pending
const pwValidation = function(pwArray, pwConditions) {
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

};

// upon event finds the matching pw id in the passStore and creates a hash for the password
// the 
export const pwVulnerabilityCheck = async function(item) {
    try{
        const pwEl = passStore.find(({_id}) => _id === Number(item));
        console.log(pwEl, pwEl.pw)
        pwEl.pwHash = hashPassword.call(pwEl, pwEl.pw);
        await comparePwVulnerability.call(pwEl, pwEl.pwHash);
    
        if(pwEl._safe) return true;
        if(!pwEl._safe) return false;
    } catch(err) {
        console.error('Unable to validate password vulnerabiity');
        throw new Error('Unable to validate password vulnerability', err);
    }

}

// create hash for password
const hashPassword = function(pw) {

    console.log('pre-hashed pw: ', pw);
    const readadablePW = pw.replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'")
        .replaceAll('&#92;', '\\')
    console.log(readadablePW);
    testHash();
    return crypto.createHash('sha1')
        .update(readadablePW)
        .digest('hex');
}

const newReadableStream = function(reader) {
    return new ReadableStream({
        start(controller) {
            function push() {

                // read() returns a promise and fulfills with either the data chunk and done: false or fulfills closed, done: true
                // returns done true when all the stream data has been returned
                reader.read().then( ({ done, value }) => {
                    if(done) {
                        // console.log('done', done);
                        controller.close();
                        return;
                    }
                    //enqueue allows for the next chunk in the data queue to be accessed, continues until stream is closed, done: true
                    controller.enqueue(value);
                    // console.log(done, value);
                    push();
                })
                // console.log(reader);
            }
            push(); 
        }
    })
}

// promise chain of comparePwVulnerability();
{
// fetch vulnerable hashed passwords that match the first five characters of the hashed password, if the remaining characters match a hash in the list it is compromised
// this api returns hundreds of suffix matches, so it 
// const comparePwVulnerability = async function(pwHash) {
//     console.log(this);
//     const hashPrefix = pwHash.slice(0, 5);
//     const hashSuffix = pwHash.slice(5);

//     //pwnedpasswords returns API requests as a readable stream
//     this._safe = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
//         .then(response => {
//             console.log(response);
//             return response.body
//         })
//         .then(rb => {
//             const reader = rb.getReader(); //creates a reader and locks stream to it

//             return new ReadableStream({
//                 start(controller) {
//                     function push() {
//                         // read() returns a promise and fulfills with either the data chunk and done: false or fulfills closed, done: true
//                         // returns done true when all the stream data has been returned
//                         reader.read().then( ({ done, value }) => {
//                             if(done) {
//                                 console.log('done', done);
//                                 controller.close();
//                                 return;
//                             }
//                             //enqueue allows for the next chunk in the data queue to be accessed, continues until stream is closed, done: true
//                             controller.enqueue(value);
//                             // console.log(done, value);
//                             push();
//                         })
//                         // console.log(reader);
//                     }
//                     push(); 
//                 }
//             });
//         })
//         //
//         .then(stream => {
//             return new Response(stream, { headers: { "Content-Type": "text/html"}}).text();
//             //.text() returns the resolved promise as a string
//         })

//         // convert the chunk to an array and call the clean up/comparison function
//         .then( result => {
//             //result is the data chunk in plain text, needs cleaned up
//             const re = /\r\n|\n|\r/gm;
//             const resultArray = Array.from(result.split(re));
//             return cleanUpChunk(resultArray, hashSuffix);
//         })
//         // returns the result of comparing the hashed password to the readableStream chunk data
//         .then(check => {
//             // console.log(check)
//             let result;

//             if(check) {
//                 // console.log('%cOh no, this password is vulnerable!', 'color: orangered');
//                 // update pwObject safe variable
//                 result = false;
//                 return result;
//             } else {
//                 // console.log('%cPassword is safe to use!', 'color: limegreen');
//                 // update pwObject safe variable
//                 result = true;
//                 return result;
//             }

//         })
//         .catch(err => {
//             console.log(err);
//         })
// }
}

// fetch vulnerable hashed passwords that match the first five characters of the hashed password, if the remaining characters match a hash in the list it is compromised
// this api returns hundreds of suffix matches, so it 
const comparePwVulnerability = async function(pwHash) {

    try {
        let result;
        const hashPrefix = pwHash.slice(0, 5);
        const hashSuffix = pwHash.slice(5);
    
        //pwnedpasswords returns API requests as a readable stream
        const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
        
        // create readableStream reader
        const reader = response.body.getReader();

        // creates new ReadableStream for the 
        const stream = await newReadableStream(reader);
        
        // creates response with given headers for the readableStream created previously
        const newResponse = await new Response(stream, { headers: { 'Content-type': 'text/html'}}).text();
    
        const check = cleanUpChunk(newResponse, hashSuffix);
    
        if(check) result = false;
        if(!check) result = true;

        this._safe = result; 

    } catch(err) {
        console.error(err);
        throw new Error('Unable to check vulnerability', err);
    };
};



// clean up the ReadableStream data chunk and compare results to generated password hash
const cleanUpChunk = function(newResponse, hashSuffix) {
    const re = /\r\n|\n|\r/gm;
    const responseArray = Array.from(newResponse
                .split(re))
                .flat()
                .map(c => c.split('')
                    .splice(0, c.indexOf(':'))
                    .join('')
                    .toLowerCase()
                );
    // console.log(responseArray, hashSuffix);
    // look for the hashSuffix in the clean array, return boolean true if found in array
    return responseArray.some(item => item === hashSuffix)
};
