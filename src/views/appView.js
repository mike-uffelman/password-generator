'use strict';


class appView {

    _parentElement = document.querySelector('body');
    _pwValidated = false;
    _pwConditions = {
        pwLength: 0,
        lowerAz: false,
        upperAz: false,
        specialChars: false,
        digits: false
    }
    
    // _form = document.querySelector('form');

    render() {
        try {
            this._clear();

            const markup = this._generateMarkup();
            this._parentElement.insertAdjacentHTML('afterbegin', markup)
            this._displayCounts();
        } catch(err) {
            console.log('something went wrong', err);
        }
        
    }

    _clear() {
        this._parentElement.innerHTML = '';
    } 

    _generateMarkup() {
        return `
        <article class="app d-flex flex-column container-md col-sm-6">
            <h1 class='px-2 py-3 mb-0 fs-3 lead bg-light text-primary'>Password Generator</h1>
            <div class='container'>
                <form action='#' class=''>
                    <div class='px-0 pt-2 text-secondary'>
                        <div>Password Length:</div>
                        <div id='pw-display'>0</div>
                    </div>
                    <input type='range' id='pw-length' class='form-range' min='2' max='64' step='1' value='2'>
                    <section class='character-select'>
                        <div class='form-check '>
                            <label class='form-check-label' for='lower-az'>Lowercase AZ</label>
                            <input type='checkbox' id='lower-az' class='form-check-input' value='true' checked> 
                        </div>
                        <div class='form-check '>
                            <label class='form-check-label' for='upper-az'>Uppercase AZ</label>
                            <input type='checkbox' id='upper-az' class='form-check-input' value='true' checked> 
                        </div>
                        <div class='sc-container'>
                            <div class='form-check '>
                                <label class='form-check-label' for='sc-count'>Special Characters</label>
                                <input type='checkbox' id='sc-count' class='form-check-input' value='false'> 
                            </div>
                                <div class='d-flex flex-row justify-content-between '>
                                    <button class="btn p-0 text-secondary d-flex" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Options
                                    <div class='options__icon expand h-100 px-3'></div>

                                    </button>
                                    
                                    
                                    
                                </div>
                        </div>
                            <div class="collapse bg-light" id="collapseExample">
                                   
                                    <div class='form-check container d-flex flex-row  py-2'>
                                        <label class='form-text-label align-self-center' for='other'>Only: </label>
                                        <input type='text' id='other' class='form-control form-control-sm mx-2' value='' placeholder='list characters separated by a comma ","'>
                                    </div>
                                
                            </div>
                        <div class='form-check '>
                            <label class='form-check-label' for='num-count'>Numbers</label>
                            <input type='checkbox' id='num-count' class='form-check-input'  value='false'>
                        </div>                    
                    </section>
                    <button id='submit-button' class='btn my-3 btn btn-outline-primary'>Generate</button>
                    
                </form>
                <section class=' shadow mt-3 px-3 py-1 bg-light border border-secondary rounded'>
                    <div class='section-header bg-light p-2 rounded'>
                        <h2 class='fs-4  m-0 fw-light text-secondary align-self-center'>Generated Passwords</h2>
                        <button id='clear-list-button' class='d-none btn btn-sm btn-outline-primary align-middle'>Clear</button>
                    </div>
                    <ul class='pw__container container list-group list-group-flush overflow-scroll bg-transparent p-0'>
                        
                    </ul>
                </section>


            </div>
        </article>
        `
    };

    // <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
// <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/></svg>

    addHandlerGenerate(handler, pwValidation) {
        const form = document.querySelector('form');
        const passwordContainer = document.querySelector('.pw__container');

        form.addEventListener('submit', (e) => {
            console.log(this);
            try {
                e.preventDefault();

                this._pwConditions.pwLength = Number(document.querySelector('#pw-length').value);
                this._pwConditions.lowerAz = document.querySelector('#lower-az').checked;
                this._pwConditions.upperAz = document.querySelector('#upper-az').checked;
                this._pwConditions.specialChars = document.querySelector('#sc-count').checked;
                this._pwConditions.digits = document.querySelector('#num-count').checked;
                
                if(this._pwConditions.pwLength === '0') throw new Error('Please set password length');

                // console.log(pwLength,lowerAZ, upperAZ, scCount, numCount);
                handler();
            } catch(err) {
                console.log(err);
                this._alert('Please select password length.', 'danger', err)
                this._removeAlert();
            }

            
            
        })

        passwordContainer.addEventListener('click', (e) => {
            if(e.target.classList.contains('search-pw-icon')) {
                console.log(this);

                const item = e.target.closest('.pw__item').dataset.id;

                // console.log('validate this password');
                // const pw = e.target.previousElementSibling.innerText;
                pwValidation(item);
            }
        })
       
        form.addEventListener('input', this._displayCounts)

        document.querySelector('#clear-list-button').addEventListener('click', (e) => {
            this._clearList();
        })
    
        document.querySelector('#copy-icon')?.addEventListener('click', this._copy);

    }

    

    
    _displayCounts() {
        const pwDisplay = document.querySelector('#pw-display');
        const pwLength = document.querySelector('#pw-length').value;
        pwDisplay.innerText = pwLength;
    };
    
    _printPassword(passStore) {
        const section = document.querySelector('section');
        const list = document.querySelector('ul');

        const password = passStore.at(-1);
        console.log(password);

        section.classList.add('bg-body');
       
        let html;    
        html = this._generateItem(password);

        list.insertAdjacentHTML('afterbegin', html);


        this._newListItemStyle();
        document.querySelector('#clear-list-button').classList.remove('d-none');
        
    };



    _generateItem(password) {
        return `
            <li class="pw__item list-group-item list-group-item-light new-pass-color bg-transparent overflow-hidden" data-id='${password._id}'>
                <div class='d-flex justify-content-between'>
                    <!-- input left for copy - which is currently unsupported -->
                    <input id='passwordText' class='visually-hidden' value='${password.pw}'></input>
                    <p id='' class='pw__item--text mb-0 text-break d-flex align-self-center'>${password.pw}</p>
                    ${this._pwSafetyIcon(password)}
                    
                </div>
            </li>        
        `

        // <img id='copy-icon' src='./images/copy.svg' width=\'15px\' height=\'15px\' class='align-self-center'>
    };

    _newListItemStyle() {
        const li = document.querySelector('li');
        
        setTimeout(() => {
            li.style.color = '#6c757d';
            li.style.transition = 'color ease 350ms';
        }, 3000)
    }

    _pwSafetyIcon(password) {
        if(password._safe === undefined) {
            return `
            <button type="button" class="btn tool-tip" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to validate password">
                <svg class='search-pw-icon d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,1.85-0.51,3.65-1.38,5.21l-1.45-1.45 c1.29-1.94,1.07-4.58-0.64-6.29c-1.95-1.95-5.12-1.95-7.07,0c-1.95,1.95-1.95,5.12,0,7.07c1.71,1.71,4.35,1.92,6.29,0.64 l1.72,1.72c-1.19,1.42-2.73,2.51-4.47,3.04C7.98,19.69,5,15.52,5,11V6.3l7-3.11l7,3.11V11z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,15,12,15z"/>
                </svg>
            </button>
            `
        };
        if(password._safe === true) {
            return `

                
                <button type="button" class="btn " data-bs-toggle="tooltip" data-bs-placement="bottom" title="Password is safe!">
                    <svg class='search-pw-icon safe d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"/>
                    </svg>
                </button>
                
                `
        };
        if(password._safe === false) {
            return `
                <button type="button" class="btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Password is vulnerable!">

                    <svg class='search-pw-icon unsafe d-flex align-self-center' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6,2.25V11.09z M9.91,8.5L8.5,9.91L10.59,12L8.5,14.09l1.41,1.41L12,13.42l2.09,2.08 l1.41-1.41L13.42,12l2.08-2.09L14.09,8.5L12,10.59L9.91,8.5z"/></g>
                    </svg>
                </button>
                `
        };
    };

    _pwVulnerabilityStyling(item, passStore) {
        console.log('%cStyling the list item...', 'color: yellow');

        const pwLi = Array.from(document.querySelectorAll('.pw__item'));
        const storeItem = passStore.find(pw => pw._id === Number(item));
        const pwLiItem = pwLi.find(pw => pw.dataset.id === item)
        const pwText = pwLiItem.querySelector('p');
        const icon = pwLiItem.querySelector('button, svg');
        let html;


        icon.remove();

        html = this._pwSafetyIcon(storeItem);
        pwText.insertAdjacentHTML('afterend', html);



        // this._pwSafetyIcon(pwLi)

        // pwLiItem.classList.remove('bg-transparent')
        // pwLiItem.classList.add('bg-success');    
        // } else {
        //     const pwLiItem = pwLi.find(pw => pw.dataset.id === item)

        //     pwLiItem.classList.remove('bg-transparent')
        //     pwLiItem.classList.add('bg-warning');    
        // }

        
    }

    _copy(e) {
        const pwText = document.querySelector('#passwordText');
        pwText.select();
        pwText.setSelectionRange(0,9999);
        document.execCommand('copy');
        this._alert('Password copied!', 'info')
        this._removeAlert();
    };
    
    //original alert within list section
    /*static alert(message, type) {
        const pwList = document.querySelector('section');
        const div = document.createElement('div');
        div.id = 'alert'
        div.classList = `alert mt-3 alert-${type}`
        div.appendChild(document.createTextNode(`${message}`))
        const ul = document.querySelector('ul');
        pwList.insertBefore(div, ul);
        //inserts below the list items within the list
        pwList.append(div);
        div.style.opacity = '1';
    }*/
    
    _alert(message, type) {
        const pwList = document.querySelector('section');
        const div = document.createElement('div');
        div.id = 'alert'
        div.classList = `alert mt-3 alert-${type}`
        div.appendChild(document.createTextNode(`${message}`))
        const ul = document.querySelector('ul');
        pwList.append(div);
        div.style.opacity = '1';
    };
    
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
    
    _clearList() {
        document.querySelector('ul').innerHTML = '';
        document.querySelector('section').classList.remove('bg-body');
        document.querySelector('#clear-list-button').classList.add('d-none');
    };


}


export default new appView();