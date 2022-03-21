'use strict';



import 'core-js/stable'; // for polyfilling
import 'regenerator-runtime/runtime.js'; //compile/transpile async func
import appView from './src/views/appView.js';
import * as logic from './src/model.js';
import * as pwValidation from './src/pwValidation.js';

if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');
}

// generate password and render controller
const generatePW = function() {
    try {
        appView._clearAlerts();
        // console.log(appView._pwConditions);
        logic.buildPw(appView._pwConditions);
        appView._printPassword(logic.passStore);
        console.log(logic.passStore);
    } catch(err) {
        console.error(err);
        appView._alert(err.message, 'danger');
        // appView._removeAlert();
    }
};

// password validation controller
const safePassValidation = async function(item) {
    try {


        appView._clearAlerts();
        // console.log('pwValidation controller item: ', item);
        appView._pendingValidation(); // pending spinner animation
        await pwValidation.pwVulnerabilityCheck(item, logic.passStore); //check password vulnerability in API
        appView._pwVulnerabilityStyling(item, logic.passStore); // vulnerability outcome UI stylng 
    } catch(err) {

        appView._alert(err.message, 'danger');
    }
}


// load app controller and event handlers
const init = function() {
    try {
        appView.render();
        appView.addHandlerGenerate(generatePW, safePassValidation);

        if(module.hot) module.hot.accept();

    } catch(err) {
        console.error(err.name, err.message);
    }
    

    

}

init();