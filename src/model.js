
    
export let pwFinal = '';

let lowerAZ = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let upperAZ = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export const draftStr = function (pwLength, scCount, numCount) {
    console.log('draft string: ', pwLength, scCount, numCount)
    // let az = new Array(Number(pwLength));
    let pwArray = [];

        for (i = 0; i < pwLength; i++) {
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
            
            //? add check that each type should be included if checked

            // az[i] = index;
            
            
            // if(roll === 1) {
            //     console.log('1')
            //     az[i] = lowerAZ[Math.floor(Math.random() * lowerAZ.length)]
            // } 

            // if(roll === 2) {
            //     az[i] = upperAZ[Math.floor(Math.random() * upperAZ.length)].toUpperCase();
            // }
            // if(roll === 3) {
            //     az[i] = specialChars[Math.floor(Math.random() * specialChars.length)]
            // } else {
            //     return false;
            // }

            // if(roll === 4 && numCount) {
            //     az[i] = digits[Math.floor(Math.random() * digits.length)]

            // } else {
            //     return false;
            // }
        }
    }
    console.log(pwArray.join(''));
    shuffle(pwArray);
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

export const shuffle = function(arr) {
    
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
    
    pwFinal = arr.join('');
}
    
const hashPass = function(pwFinal) {
    console.log('hashing password...')
}
