'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import appView from './src/views/appView.js';
import * as logic from './src/model.js';
import appView from './src/views/appView.js';

if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

const generatePW = function(pwLength, scCount, numCount) {
    try {
        console.log('creating password...', pwLength, scCount, numCount)
        logic.draftStr(pwLength, scCount, numCount);
        console.log(logic.pwFinal);
        appView._printPassword(logic.pwFinal);
        appView._alert('New password created!', 'success');
        appView._removeAlert();


    } catch(err) {
        console.error('something went wrong', err);
        appView._removeAlert();
    }
};

//! previous alorithm=======================
// const generatePW = function(pwLength, scCount, numCount) {
//     try {
//         console.log('creating password...', pwLength, scCount, numCount)
//         logic.draftStr(pwLength, scCount, numCount);
//         console.log(logic.pwFinal);
//         appView._printPassword(logic.pwFinal);

//     } catch(err) {
//         console.error('something went wrong', err);
//     }
// };
//!========================================

const init = function() {
    appView.render();
    appView.addHandlerGenerate(generatePW);

    if (module.hot) {
        module.hot.accept();
    }
}

init();