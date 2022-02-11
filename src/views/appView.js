'use strict';


class appView {

    _parentElement = document.querySelector('body');
    _pwValidated = false;
    
    // _form = document.querySelector('form');

    render() {
        try {
            this._clear();

            const markup = this._generateMarkup();
            this._parentElement.insertAdjacentHTML('afterbegin', markup)
        } catch(err) {
            console.log('something went wrong', err);
        }
        
    }

    _clear() {
        this._parentElement.innerHTML = '';
    } 

    _generateMarkup() {
        return `
        <article class="app d-flex flex-column container-md col-sm-6 ">
            <h1 class='px-2 py-3 mb-0 fs-3 lead bg-light text-primary'>Password Generator</h1>
            <div class='container'>
                <form action='#' class=''>
                    <div class='px-0 pt-2 text-secondary'>
                        <div>Password Length:</div>
                        <div id='pw-display'>0</div>
                    </div>
                    <input type='range' id='pw-length' class='form-range' min='0' max='64' step='1' value='0'>
                    <div class='form-check '>
                        <label class='form-check-label' for='sc-count'>Special Characters</label>
                        <input type='checkbox' id='sc-count' class='form-check-input' value='false'> 
                    </div>
                    <div class='form-check '>
                        <label class='form-check-label' for='num-count'>Numbers</label>
                        <input type='checkbox' id='num-count' class='form-check-input'  value='false'>
                    </div>                    
                    <button id='submit-button' class='btn my-3 btn btn-outline-primary'>Generate</button>
                    
                </form>
                <section class=' shadow mt-3 p-3 bg-light border border-secondary rounded'>
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

    addHandlerGenerate(handler, pwValidation) {
        const form = document.querySelector('form');
        const passwordContainer = document.querySelector('.pw__container');

        form.addEventListener('submit', (e) => {
            console.log(this);
            try {
                e.preventDefault();
            
                const pwLength = document.querySelector('#pw-length').value;
                const scCount = document.querySelector('#sc-count').checked;
                const numCount = document.querySelector('#num-count').checked;
                
    
                if(pwLength === '0') throw new Error('Please set password length');

                console.log(pwLength, scCount, numCount);
                handler(pwLength, scCount, numCount);
            } catch(err) {
                this._alert('Please select password length.', 'danger')
                this._removeAlert();
            }

            
            
        })

        passwordContainer.addEventListener('click', (e) => {
            if(e.target.classList.contains('search-pw-icon')) {
                console.log(this);

                console.log('validate this password');
                const pw = e.target.previousElementSibling.innerText;
                pwValidation(pw);
            }
        })

        // pwItem?.forEach(pw => {
        //     pw.addEventListener('click', (e) => {
        //         console.log(e.target);
            
        //     })
        // })

   



        //! previous algorithm ==============================================
        // form.addEventListener('submit', (e) => {
        //     e.preventDefault();
            
        //     const pwLength = document.querySelector('#pw-length').value;
        //     const scCount = document.querySelector('#sc-count').value;
        //     const numCount = document.querySelector('#num-count').value;
            
        //     if(pwLength === '0') {
        //         this._alert('Please select password length.', 'danger')
        //     } else {
        //         handler(pwLength, scCount, numCount);
        //         this._alert('New password created!', 'success');
        //     }
            
        //     this._removeAlert(); //!
            
        // })
        //! ===================================================================

        // document.querySelectorAll('.form-range').forEach(slide = () => {
        //     slide.addEventListener('change', this._displayCounts);
        // })
        form.addEventListener('input', this._displayCounts)

        document.querySelector('#clear-list-button').addEventListener('click', (e) => {
            this._clearList();
        })
    
        document.querySelector('#copy-icon')?.addEventListener('click', this._copy);

    }

    

    
    _displayCounts() {
        
        // const slider = document.querySelectorAll('.form-range');
        // console.log(slider);

        // slider.forEach(slide = (e) => {
        //     console.log(slide);
        // });




        const pwDisplay = document.querySelector('#pw-display');
        // const scDisplay = document.querySelector('#sc-display');
        // const numDisplay = document.querySelector('#num-display');


        const pwLength = document.querySelector('#pw-length').value;
        pwDisplay.innerText = pwLength;
        
        // const scCount = document.querySelector('#sc-count').value;
        // scDisplay.innerText = scCount;
        
        // const numCount = document.querySelector('#num-count').value;
        // numDisplay.innerText = numCount;
        
        /*if(pwLength < (scCount + numCount)) {
            pwDisplay.innerText = scCount + numCount;
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        } else {
            pwDisplay.innerText = pwLength;
            scDisplay.innerText = scCount;
            numDisplay.innerText = numCount;
        }*/
        
    };
    
    _printPassword(passStore) {
        const section = document.querySelector('section');
        const list = document.querySelector('ul');

        const password = passStore.at(-1);

        section.classList.add('bg-body');
       
        let html;    
        html = this._generateItem(password);

        list.insertAdjacentHTML('afterbegin', html);


        this._newListItemStyle();
        document.querySelector('#clear-list-button').classList.remove('d-none');
        
    };


    _generateItem(password) {
        return `
            <li class="pw__item list-group-item list-group-item-light new-pass-color bg-transparent" data-id='${password._id}'>
                <div class='d-flex justify-content-between'>
                    <input id='passwordText' class='visually-hidden' value='${password.pw}'></input>
                    <p id='' class='pwItem mb-0 text-break'>${password.pw}</p>
                    <svg class='search-pw-icon' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                            <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M19,11c0,1.85-0.51,3.65-1.38,5.21l-1.45-1.45 c1.29-1.94,1.07-4.58-0.64-6.29c-1.95-1.95-5.12-1.95-7.07,0c-1.95,1.95-1.95,5.12,0,7.07c1.71,1.71,4.35,1.92,6.29,0.64 l1.72,1.72c-1.19,1.42-2.73,2.51-4.47,3.04C7.98,19.69,5,15.52,5,11V6.3l7-3.11l7,3.11V11z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,15,12,15z"/>
                    </svg>
                    

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