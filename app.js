'use strict';



import 'core-js/stable'; // for polyfilling
import 'regenerator-runtime/runtime.js';
import appView from './src/views/appView.js';
import * as logic from './src/model.js';
import appView from './src/views/appView.js';

if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

// generate password and render controller
const generatePW = function() {
    try {
        console.log(appView._pwConditions);
        logic.buildPw(appView._pwConditions);
        appView._printPassword(logic.passStore);
        appView._alert('New password created!', 'success');
        appView._removeAlert();
    } catch(err) {
        appView._alert(err.message, 'danger');
        appView._removeAlert();
    }
};

// password validation controller
const safePassValidation = async function(item) {
    try {
        await logic.pwVulnerabilityCheck(item);
        appView._pwVulnerabilityStyling(item, logic.passStore);
    } catch(err) {
        appView._alert(err.message, 'danger');
        appView._removeAlert();
    }
}


// load app controller and event handlers
const init = function() {
    appView.render();
    appView.addHandlerGenerate(generatePW, safePassValidation);

    if (module.hot) {
        module.hot.accept();
    }
}

init();