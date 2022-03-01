'use strict';




// view class - all app UI
class appView {
    _parentElement = document.querySelector('body');
    _pwConditions = {}
    
    //build the initial markup for the app
    render() {
        try {
            //remove/prevent duplicate markup on hot module load
            this._clear();
            
            //render the form markup
            const markup = this._generateMarkup();
            this._parentElement.insertAdjacentHTML('afterbegin', markup)

            //update the range to default value 
            this._displayCounts();

        } catch(err) {
            console.log('something went wrong', err);
            throw new Error(err.message);
        }
        
    }

    //reset parent element
    _clear() {
        this._parentElement.innerHTML = '';
    } 

    //markup for the form
    _generateMarkup() {
        return `
        <article class="app d-flex flex-column container col-lg-6">
            <h1 class='pt-2 pb-1 fw-normal bg-light text-primary'>Password Generator</h1>
            <div class='container px-0'>
                <form action='#' class='d-flex flex-column p-0'>
                    <div class='m-0 px-0'>
                        <div class='form-check px-0 d-flex flex-row justify-content-between'>
                            <label class='form-check-label'>Password Length</label>
                            <div id='pwDisplay'>0</div>
                        </div>
                    </div>
                    <input type='range' id='pwLength' class='form-range' min='2' max='64' step='1' value='2'>
                    <section class='character-select form-check my-0 p-0 py-2'>
                        <div class='form-check '>
                            <label class='form-check-label' for='lowerAZCheckbox'>Lowercase A-Z</label>
                            <input type='checkbox' id='lowerAZCheckbox' class='form-check-input' value='true' checked> 
                        </div>
                        <div class='form-check '>
                            <label class='form-check-label' for='upperAZCheckbox'>Uppercase A-Z</label>
                            <input type='checkbox' id='upperAZCheckbox' class='form-check-input' value='true' checked> 
                        </div>
                        <div class='sc-container form-check d-flex flex-row justify-content-between'>
                            <div class=' d-flex'>
                                <label class='form-check-label align-self-center ' for='specCharCheckbox'>Special Characters
                                    <button type="button" class="btn btn-icons tool-tip p-0" data-toggle="tooltip" data-placements='top' title="&#33&#34&#35&#36&#37&#38&#39&#40&#41&#42&#43&#44&#45&#46&#47&#58&#59&#60&#61&#62&#63&#64&#91&#92&#93&#94&#95&#96&#123&#124&#125&#126">
                                        <svg class='btn-icons info d-flex justify-content-center align-items-center' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 36 36" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path class='justify-self-center align-self-center' d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                                    </button

                                </label>
                                <input type='checkbox' id='specCharCheckbox' class='form-check-input' value='false'> 
                            </div>
                            <button class="btn p-0 text-secondary d-flex flex-row justify-content-between align-items-center  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOptions" aria-expanded="false" aria-controls="collapseOptions">
                                <p class='btn-options m-0'>Options</p>
                                
                                <div class='options__icon h-100 justify-self-center align-self-center'>
                                    <svg class='h-100 w-100' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
                                </div>
                            </button>
                        </div>
                        <div class="collapse bg-light container " id="collapseOptions">
                            <div class='form-check'>
                                <input type='checkbox' id='sc-options' class='form-check-input ' value='false'>    
                                <label class='form-text-label align-self-center' for='sc-options'>Only: </label>
                                <input type='text' id='other-chars' class='form-control form-control-sm border border-primary mt-1' ${document.querySelector('#sc-options')?.checked ? 'required' : ''} value='' placeholder='Specify characters to include (no spaces or delimiters)'>
                            </div>
                        </div>
                        <div class='form-check '>
                            <label class='form-check-label' for='numbersCheckbox'>Numbers</label>
                            <input type='checkbox' id='numbersCheckbox' class='form-check-input'  value='false'>
                        </div>                    
                    </section>
                    <button id'' type='submit' class='btn btn-outline-primary'>Generate</button>
                </form>
                <section class='pw__box p-2 pb-0 my-3 shadow bg-light border border-1 border-primary rounded'>
                    <div class='pw__box--header section-header bg-light p-2 rounded'>
                        <h2 class='m-0  text-primary align-self-center'>Generated Passwords</h2>
                        <button id='clear-list-button' class='d-none btn btn-sm btn-outline-primary align-middle'>Clear</button>
                    </div>
                    <ul class='pw__container container list-group list-group-flush overflow-scroll bg-transparent p-0'></ul>
                </section>
            </div>
        </article>
        `
    };

    //event handler for form submit, password validation and copy
    addHandlerGenerate(handler, pwValidation) {
        const form = document.querySelector('form');
        const passwordContainer = document.querySelector('.pw__container');

        form.addEventListener('submit', (e) => {
            try {
                e.preventDefault();

                this._getPwConditions();

                // resets the scOptionsChars property each event call
                if(!document.querySelector('#sc-options').checked) delete this._pwConditions.scOptionChars;

                // pwLength must be >= the conditions boxes checked, throws error if less than
                let count = 0;
                Object.values(this._pwConditions).forEach(obj => obj === true ? count++ : '')
                
                if(this._pwConditions.pwLength < count) throw new Error('Please set password length');

                handler();
            } catch(err) {
                console.log(err);
                this._alert(err.message, 'warning', err)
                this._removeAlert();
            }

            
            
        })

        //individual password event handlers
        passwordContainer.addEventListener('click', async (e) => {
            
            // validate password event
            if(e.target.id === 'search-pw-icon') {
                console.log('clicking validation button...')
                const item = e.target.closest('.pw__item').dataset.id;
                pwValidation(item);
                console.log(item);
            }

            // copy password event
            if(e.target.id === 'icon-copy') this._copy();

        })
       
        // update the password length display count
        form.addEventListener('input', this._displayCounts);

        // special character checkbox validation
        form.addEventListener('change', this._updateChecks);

        document.querySelector('#clear-list-button').addEventListener('click', (e) => {
            this._clearList();
        })
    
        // document.querySelector('#icon-copy')?.addEventListener('click', (e) => this._copy(e));

    }

    _getPwConditions() {
        this._pwConditions.pwLength = Number(document.getElementById('pwLength').value);
        this._pwConditions.lowerAz = document.getElementById('lowerAZCheckbox').checked;
        this._pwConditions.upperAz = document.getElementById('upperAZCheckbox').checked;
        this._pwConditions.specialChars = document.getElementById('specCharCheckbox').checked;
        this._pwConditions.specialCharsOption = document.getElementById('other-chars').checked;
        this._pwConditions.digits = document.getElementById('numbersCheckbox').checked;
        
        this._validatePwConditions();
        //if scOptions checked, create array property with desired characters
        

        
    }

    _validatePwConditions() {
        if(document.querySelector('#sc-options').checked) {

            //if scOptions checked(i.e. create an array for sc), but empty throw an error
            if(document.querySelector('#other-chars').value.length === 0) throw new Error('Please enter required special characters');

            //check for characters other than special chars
            // const re =  new RegExp(`(?=.*[a-z]){1,}|(?=.*[A-Z]){1,}|(?=.*[0-9]){1,}|(?=.*[\\s]){1,}`, 'g');
            const re = new RegExp('(?=.*[a-zA-Z0-9\\s])', 'g')
            const scOptCharsStr = document.querySelector('#other-chars').value;
            if(re.test(scOptCharsStr)) throw new Error('Only special characters allowed!') 
            
            
            

            // if no error, use new Set to remove possible duplicates, then convert to array and set pw condition to the array
            const scOptCharsArray = Array.from(new Set(document.querySelector('#other-chars').value));

            console.log(scOptCharsArray);

            const scrubUnsafeChars = scOptCharsArray.toString()
                    .replaceAll('&', '&amp;')
                    .replaceAll('<', '&lt;')
                    .replaceAll('>', '&gt;')
                    .replaceAll('"', '&quot;')
                    .replaceAll("'", '&#39;')
                    .replaceAll('\\', '&#92;')
            
            console.log(scrubUnsafeChars);


            this._pwConditions.scOptionChars = scrubUnsafeChars.split(',');
            console.log(this._pwConditions);
        }

        
        //ensure at least one character type is checked
        const conditions = Object.values(this._pwConditions).slice(1);
        if(conditions.every(option => option === false)) throw new Error('Please select a character type.');
    }
    
    // prevent only characters checkbox without special characters checkbox
    _updateChecks() {
        const specChars = document.querySelector('#specCharCheckbox');
        const specCharsOptions = document.querySelector('#sc-options');

        if(!specChars.checked) {
            specChars.checked = false;
            specCharsOptions.checked = false;
        }
    }

    // display the password length value
    _displayCounts() {
        const pwDisplay = document.getElementById('pwDisplay');
        const pwLength = document.getElementById('pwLength').value;
        pwDisplay.innerText = pwLength;
    };
    
    // generate markup and print generated password to DOM
    _printPassword(passStore) {
        const pwBox = document.querySelector('.pw__box');
        const list = document.querySelector('ul');

        console.log(passStore.at(-1).pw);
        //get the latest generated password from the passStore object
        const password = passStore.at(-1);
        // const password = pw.split('').map(p => {
        //         return p.replaceAll('&', '&amp;')
        //         .replaceAll('<', '&lt;')
        //         .replaceAll('>', '&gt;')
        //         .replaceAll('"', '&quot;')
        //         .replaceAll("'", '&#39;')
        //         .replaceAll('\\', '&#92;')
    // })

        console.log('password: ', password)
        pwBox.classList.add('bg-body');
        pwBox.style.opacity = '1';
       
        // generate and insert html 
        let html;    
        html = this._generateItem(password);
        list.insertAdjacentHTML('afterbegin', html);

        // new item styling
        this._newListItemStyle();
        document.getElementById('clear-list-button').classList.remove('d-none');
        
    };


    // password list item markup
    _generateItem(password) {
        // console.log(password.join(''));
        return `
            <li class="pw__item py-2 list-group-item list-group-item-light new-pass-color bg-transparent overflow-hidden" data-id='${password._id}'>
                <div class='d-flex justify-content-between w-100'>
                    <input id='passwordText' class='visually-hidden' value='${password.pw}'></input>
                    <p id='' class='pw__item--text mb-0 text-break d-flex justify-self-start align-self-center'>${password.pw}</p>
                    
                    <div class='icon__box d-flex justify-self-end'>
                        ${this._pwSafetyIcon(password)}
                        
                        <button id='icon-copy' type="button" class="btn btn-icons tool-tip" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to copy password">
                            <svg class='icon__box copy'xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        </button>
                        
                    </div>
                </div>
            </li>        
        `
    };

    // new password styling
    _newListItemStyle() {
        const li = document.querySelector('.pw__item');
        setTimeout(() => {
            li.style.color = '#6c757d';
            li.style.backgroundColor = '#198754';
            li.style.transition = 'color ease 350ms';
        }, 3000)
    }

    // update the password validation icon
    _pwSafetyIcon(password) {
        if(password._safe === undefined) {
            return `
            <button id='search-pw-icon' type="button" class="btn btn-icons tool-tip" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to validate password">
                <svg class='search-pw-icon btn-icons search d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,1.85-0.51,3.65-1.38,5.21l-1.45-1.45 c1.29-1.94,1.07-4.58-0.64-6.29c-1.95-1.95-5.12-1.95-7.07,0c-1.95,1.95-1.95,5.12,0,7.07c1.71,1.71,4.35,1.92,6.29,0.64 l1.72,1.72c-1.19,1.42-2.73,2.51-4.47,3.04C7.98,19.69,5,15.52,5,11V6.3l7-3.11l7,3.11V11z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,15,12,15z"/>
                </svg>
            </button>
            `
        };
        if(password._safe === true) {
            return `
                <button type="button" class="btn btn-icons" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Password is safe!">
                    <svg class='btn-icons safe d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"/>
                    </svg>
                </button>
                
                `
        };
        if(password._safe === false) {
            return `
                <button type="button" class="btn btn-icons" data-bs-toggle="tooltip" data-bs-placement="top" title="Password is vulnerable!">

                    <svg class='btn-icons unsafe d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6,2.25V11.09z M9.91,8.5L8.5,9.91L10.59,12L8.5,14.09l1.41,1.41L12,13.42l2.09,2.08 l1.41-1.41L13.42,12l2.08-2.09L14.09,8.5L12,10.59L9.91,8.5z"/></g>
                    </svg>
                </button>
                `
        };
    };

    _pwVulnerabilityStyling(item, passStore) {

        const pwLi = Array.from(document.querySelectorAll('.pw__item'));
        const storeItem = passStore.find(pw => pw._id === Number(item));
        const pwLiItem = pwLi.find(pw => pw.dataset.id === item)
        const iconBox = pwLiItem.querySelector('.icon__box');
        const icon = pwLiItem.querySelector('button, svg');
        let html;

        icon.remove();

        html = this._pwSafetyIcon(storeItem);
        iconBox.insertAdjacentHTML('afterbegin', html);

        // alerts for password validation outcome
        storeItem._safe ? this._alert('This password is safe!', 'success') : this._alert('This password is vulnerable!', 'danger');
        this._removeAlert();
    }

    // copy function for passwords
    _copy() {
        // checks to allow clipboard access and adds selected text to browser clipboard
        const pwText = document.getElementById('passwordText').value;
        navigator.clipboard.writeText(pwText);

        this._alert('Password copied to clipboard', 'info')
        this._removeAlert();
    };
    
    // create alerts and display
    _alert(message, type) {
        const pwList = document.querySelector('.pw__container');
        const container = document.querySelector('article')

        const div = document.createElement('div');
        div.id = 'alert'
        div.classList = `alert mb-2  alert-${type}`
        div.appendChild(document.createTextNode(`${message}`))
        const ul = document.querySelector('ul');
        container.append(div);
        div.style.opacity = '1';
    };
    
    // timeout function to remove alerts
    _removeAlert() {
        setTimeout(() => {
            const div = document.querySelector('#alert');
            div.style.opacity = '0';
            div.style.transition = 'opacity ease-in-out 350ms'
            /*document.querySelector('#alert').remove();*/
        }, 2500);
        
        setTimeout(() => {
            document.querySelector('#alert').remove();
        }, 3000);
    };
    
    // clear the generated password list and hide clear button
    _clearList() {
        document.querySelector('ul').innerHTML = '';
        document.querySelector('.pw__box').classList.remove('bg-body');
        document.querySelector('#clear-list-button').classList.add('d-none');
    };


}


export default new appView();