'use strict';



import 'core-js/stable';
import 'regenerator-runtime/runtime';
import appView from './src/views/appView.js';
import * as logic from './src/model.js';
import appView from './src/views/appView.js';

if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

const generatePW = function() {
    try {
        console.log('creating password...', appView._pwConditions)
        logic.draftStr(appView._pwConditions);
        // console.log(logic.pwFinal);
        appView._printPassword(logic.passStore);
        appView._alert('New password created!', 'success');
        appView._removeAlert();


    } catch(err) {
        console.error('something went wrong', err);
        appView._removeAlert();
    }
};

const safePassValidation = async function(item) {
    try {
        console.log('validating password...', item)
        await logic.vulnerabilityCheck(item);
        console.log(logic.passStore);
        appView._pwVulnerabilityStyling(item, logic.passStore);
    } catch(err) {
        console.log('unable to validate password', err);
    }
}


const init = function() {
    appView.render();
    appView.addHandlerGenerate(generatePW, safePassValidation);


    //az 97-122
//AZ 65-90
//sc 33-47, 91-96, 123-126 
//nums 48-57



    if (module.hot) {
        module.hot.accept();
    }
}

init();