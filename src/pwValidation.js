
import * as helper from './helpers.js';
const crypto = require('crypto');

// import * as logic from './model.js';

// upon event finds the matching pw id in the passStore and creates a hash for the password
// the 
export const pwVulnerabilityCheck = async function(item, passStore) {
    try{
        const pwEl = passStore.find(({_id}) => _id === Number(item));
        
        const normalizedPw = helper.htmlEntityRefToChar(pwEl.pw);


        pwEl.pwHash = hashPassword.call(pwEl, normalizedPw);
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
    try {
        return crypto.createHash('sha1')
            .update(pw)
            .digest('hex');
    } catch(err) {
        throw new Error('hashPassword Error...', err);
    }
}

const newReadableStream = function(reader) {
    return new ReadableStream({
        start(controller) {
            function push() {

                // read() returns a promise and fulfills with either the data chunk and done: false or fulfills closed, done: true
                // returns done true when all the stream data has been returned
                reader.read().then( ({ done, value }) => {
                    if(done) {
                        controller.close();
                        return;
                    }
                    //enqueue allows for the next chunk in the data queue to be accessed, continues until stream is closed, done: true
                    controller.enqueue(value);
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
    // look for the hashSuffix in the clean array, return boolean true if found in array
    return responseArray.some(item => item === hashSuffix)
};
