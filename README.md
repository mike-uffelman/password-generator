# password-generator

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">password-generator</h3>

  <p align="center">
    Simple, secure password generator
    <br />
    <a href="https://github.com/mike-uffelman/password-generator"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/mike-uffelman/password-generator">View Demo</a>
    ·
    <a href="https://github.com/mike-uffelman/password-generator/issues">Report Bug</a>
    ·
    <a href="https://github.com/mike-uffelman/password-generator/issues">Request Feature</a>
  </p>
</div>

## TL;DR 🤷‍♂️

This is a password generator built with vanilla JavaScript and Bootstrap. Features include the ability to select the password length and major character types. In addition, you can copy to the clipboard and check the vulnerability of the generated password against the Pwned Passwords API. Demo the app here.

<br>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details>
  <summary>Password Generator</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#going-forward">Going Forward</a></li>
    <li><a href="#considerations">Considerations</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
<br>
<!-- ABOUT THE PROJECT -->

## About The Project

This password generator is designed to output complex and safe passwords to meet common password requirements. The generator allows for passwords of up to 64 characters and a combination of character types including the lowercase and uppercase alphabet (A to Z), special characters (ASCII up to #126) or user defined special characters, and numbers (0 - 9).

Additional features include the ability to copy passwords to the browser clipboard and check the generated passwords' vulnerability (i.e. if it has been compromised in a data breach) against the pwnedpasswords API database.
<br><br>
[![Product Name Screen Shot][product-screenshot]]('./images//readMeImgs/readme-main.png')
<br>

### Built With

- JavaScript
- [Bootstrap](https://getbootstrap.com)
- Pwned Passwords API

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](link).

<p align="right">(<a href="#top">back to top</a>)</p>

## Background & Discussion

When the project initially started, the project scope was limited to creating a simple password generator that allowed the user to select a password length, special characters, and numbers. After leaving it as is for several months I returned to the project to re-evaluate and decided to update several aspects and add new features. The revisions included an updated password generating alorithm and additional features that improve the quality of life for the user, such as copy to clipboard and check password vulnerability lookup.

In the design and revist to the project, I intentionally have not used any JavaScript frameworks, this was to ensure I could practice and implement the fundamentals as well as problem solve on my own.

There were many new and welcomed challenges which arose while developing this project, some of which include readable streams (having only worked with well defined JSON prior), regular expression pattern matching for input validation and sanitization, architecture redesign

## Architecture & Design

- Architecture
  - The application is built with a Model View Controller (MVC) pattern and utilizes an object-oriented programming (OOP) approach to organize and manage object instances.
    <br><br>
- Password Algorithm & Validation
  - Using a while...switch algorithm takes a random number from crypto.getRandomValues() (Crypto Web API) to select the character type (az, AZ, 09, SC) at each password index based on desired password length, then another random value to assign as the character value of the index from the ASCII decimal value corresponding the range of the character type.
  - From the ASCII decimal values the indexes are converted to Latin characters.
  - Uses regular expression pattern matching to ensure the generated password contains at lease one of each character type the user has chosen, if not it will try again.
    <br><br>
- Form & Data Validation

  - The form validation (client side) includes the following:
    - User must select at least one (1) character type
    - The password length must be greater than or equal to the number of character types selected, i.e. if a-z, A-Z, and special characters are checked, the password length must be greater than or equal to three (3).
    - using regular expressions, the user input may only contain special characters, and of which the HTML vulnerable characters (&lt; &gt; &amp; &quot; &apos; &bsol;) are converted to HTML entity codes to sanitize the inputs
    - Regular expression also used pattern to ensure desired characters are in the generated password

- The user interface was designed to ensure the application is easy to use and intuitive for the user.
<hr>

<!-- USAGE EXAMPLES -->

## Usage

This is the basic usage of the application:

1.  User populates the form to the desired password conditions and clicks 'Generate' to submit the form.
    <br>
    [![Password Generator form screenshot][form-screenshot]]('./images/readMeImgs/form.png')

2.  Upon output of the generated password the user may:
    [![Password Generator ouput screenshot][item-screenshot]]('./images/readMeImgs/pwItem.png')

    - click the icon with a shield search icon [![shield-search]]('./images/password-check.svg') which will compare the generated password to the pwnedpassword API database of compromised password
    - click the copy icon [![copy-icon]]('./images/copy2.svg') to copy the password to the browsers clipboard for ease of use elsewhere

    <br>
    <br>

    [![Validated Passwords][checked-passwords]('./images/password-validation.png']

3.  Other actions includes a help/instructions button i and the ability to clear the current list of generated passwords with 'Clear'.

Expanded user defined special characters

2. Prior to execution to generate the password the app will peform form validation to ensure:
   - at least one character type checkbox is checked
   - the password length is greater than or equal to the number of character types selected
   - if the 'Only' user defined special characters field is checked, special characters have been entered in the input field, in addition, no a-z, A-Z, 0-9, or spaces are accepted
     - duplicate special characters will be removed
   - the 'Only' user defined special characters checkbox cannot be checked without the parent special characters checked

Form validation failures will throw a new error and display an alert to the user.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>

## Going Forward

Additional features may include:

- Expand the character base to extended ASCII
- Allow user enter a password and check against the Pwned Passwords API
- Dark mode

<p align="right">(<a href="#top">back to top</a>)</p>

## Considerations & Disclosure

This is a project

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
[![GitHub][github-shield]][github-url]
[![Project][project-shield]][project-repo]

<p align="right">(<a href="#top">back to top</a>)</p>

[issues-shield]: https://img.shields.io/github/issues/mike-uffelman/password-generator.svg?style=for-the-badge
[issues-url]: https://github.com/mike-uffelman/password-generator/issues
[license-shield]: https://img.shields.io/github/license/mike-uffelman/password-generator.svg?style=for-the-badge
[license-url]: https://github.com/mike-uffelman/password-generator/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-profile-blue
[linkedin-url]: https://www.linkedin.com/in/michael-uffelman-34289521/
[product-screenshot]: images/readMeImgs/main.png
[form-screenshot]: images/readMeImgs/form-inputs.png
[item-screenshot]: images/readMeImgs/password-output.png
[icons-screenshot]: images/readMeImgs/icons.png
[github-url]: https://github.com/mike-uffelman
[github-shield]: https://img.shields.io/badge/GitHub-profle-orange
[project-shield]: https://img.shields.io/badge/GitHub-repo-gray?color=#6cc644
[project-repo]: https://github.com/mike-uffelman/password-generator
[shield-search]: images/check_password.svg
[copy-icon]: images/copy2.svg
[checked-passwords]: ./images/password-validation.png
