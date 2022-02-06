


class appView {

    _parentElement = document.querySelector('body');
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
            <h1 class='px-3 py-3 mb-0 fs-3 lead bg-light text-primary'>Password Generator</h1>
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
                    <ul class='container list-group list-group-flush overflow-scroll bg-transparent p-0'>
                        
                    </ul>
                </section>


            </div>
        </article>
        `
    };

    addHandlerGenerate(handler) {
        const form = document.querySelector('form');

        form.addEventListener('submit', (e) => {
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
    
    _printPassword(finalStr) {
        const section = document.querySelector('section');
        const list = document.querySelector('ul');

        section.classList.add('bg-body');
       
        let html;    
        html = this._generateItem(finalStr);

        list.insertAdjacentHTML('afterbegin', html);


        this._newListItemStyle();
        document.querySelector('#clear-list-button').classList.remove('d-none');
        
    };


    _generateItem(finalStr) {
        return `
            <li class="list-group-item list-group-item-light new-pass-color bg-transparent">
                <div class='d-flex justify-content-between'>
                    <input id='passwordText' class='visually-hidden' value='${finalStr}'></input>
                    <p id='' class='pwItem mb-0 text-break'>${finalStr}</p>
                    <img id='copy-icon' src='./images/copy.svg' width=\'15px\' height=\'15px\' class='align-self-center'>
                </div>
            </li>        
        `
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