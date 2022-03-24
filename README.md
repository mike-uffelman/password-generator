# password-generator

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">password-generator</h3>
<br>
  <p align="center">
    Simple, secure password generator
    <br />
    <a href="https://github.com/mike-uffelman/password-generator">View Demo</a>
    ·
    <a href="https://github.com/mike-uffelman/password-generator/issues">Report Bug</a>
    ·
    <a href="https://github.com/mike-uffelman/password-generator/issues">Request Feature</a>
  </p>
</div>
<br>

## TL;DR 🤷‍♂️

This is a password generator built with vanilla JavaScript and Bootstrap. Features include the ability to select the password length and major character types. In addition, the user can copy to the clipboard and check the vulnerability of the generated password against the Pwned Passwords API. [Demo the app here](https://pensive-snyder-295e29.netlify.app).

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
    <li><a href="#background-and-discussion">Background & Discussion</a></li>
    <li><a href="#architecture-and-design">Architecture & Design</a></li>
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

Additional features include the ability to copy passwords to the browser clipboard and check the generated password's vulnerability (i.e. if it has been compromised in a data breach) against the Pwned Passwords API.
<br><br>
[![Product Demo][usage-demo]]('./images//readMeImgs/readme-main.png')
<br>

### Built With

- JavaScript
- [Bootstrap](https://getbootstrap.com)
- [Pwned Passwords API](https://haveibeenpwned.com/API/v3)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)

<p align="right">(<a href="#password-generator">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](link).

<p align="right">(<a href="#password-generator">back to top</a>)</p>

## Background and Discussion

The initial planned project scope was limited to creating a simple password generator that allowed the user to select a password length, special characters, and numbers. After leaving it as is for several months I returned to the project to re-evaluate and decided to update several aspects and add new features. The revisions included an updated password generating alorithm and additional features that improve the quality of life for the user, such as copy to clipboard and check password vulnerability lookup.

In the design and revist to the project, JavaScript frameworks have been intentionally omitted, this was to practice the fundamentals as well as leave many development problems left unsolved for me to figure out.

There were many new and welcomed challenges which arose while developing this project, some of which included readable streams (having only worked with well defined JSON prior), regular expression pattern matching for input validation and data sanitization, architecture redesign, and extensive HTML templating.

## Architecture and Design

- Architecture
  - The application is built with a Model View Controller (MVC) architecture pattern and utilizes an object-oriented programming (OOP) approach to organize and manage object instances.
    <br><br>
- Password Algorithm & Validation
  - The algorithm to create the a password takes a random number from crypto.getRandomValues() (Web Crypto API) to select the character type (az, AZ, 09, SC) at each index up to the user defined password length, at each index another random value is generated to assign as the character value of the index from the ASCII decimal value corresponding to the range of the character type.
    - According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#sect1):
      > Note: Math.random() does not provide cryptographically secure random numbers. Do not use them for anything related to security. Use the Web Crypto API instead, and more precisely the window.crypto.getRandomValues() method.
    - For this reason, it seemed like a good opportunity to use the Web Crypto API instead of the Math.random() method.
  - From the ASCII decimal values the indexes are converted to the readable Latin characters.
  - After the password is generated, the password is tested against a regular expression pattern matching to ensure the generated password contains at lease one of each character type the user has chosen, if not it will try again.
  - If the password passes the character type validation, the password is shuffled once more. While not necessarily required, it was a nice feature to add as it utilizes a Fisher-Yates shuffle.
  - Checking the generated password's vulnerability against the Pwned Passwords API requires the password to be hashed, the first five characters (prefix) of the hash is sent in the fetch request and all passwords with matching prefix characters are returned as hashes (less the prefix). The generated password hash suffix (last 35 characters) are compared against the returned list from the API.
    <br><br>
- Form & Data Validation

  - The form validation (client side) includes the following:
    - User must select at least one (1) character type
    - The password length must be greater than or equal to the number of character types selected, e.g. if a-z, A-Z, and special characters are checked, the password length must be greater than or equal to three (3).
    - Using regular expressions pattern matching, the user input may only contain special characters, and of which the HTML vulnerable characters (&lt; &gt; &amp; &quot; &apos; &bsol;) are converted to HTML entity codes to sanitize the inputs.
    - If the 'Only' user defined special characters field is selected, the input must have special characters, a logic function and HTML form input 'required' is enabled.
    - If the 'Only' user defined special characters field is not selected, the input field is disabled.
    - As the user input of special characters is limited to only special characters and encodes the vulnerable special characters, Cross Site Scripting attacks methods are reduced.

<hr>

<!-- USAGE EXAMPLES -->

## Usage

This is the basic usage of the application:

1.  User populates the form to the desired password conditions and clicks 'Generate' to submit the form.
    <br>
    [![Password Generator form screenshot][form-screenshot]]('./images/readMeImgs/form.png')

2.  Upon output of the generated password the user may:
    [![Password Generator ouput screenshot][item-screenshot]]('./images/readMeImgs/pwItem.png')

    - click the icon with a shield search icon ![shield-search] which will compare the generated password to the Pwned Password API database of compromised passwords
      ![Validated-Password][checked-passwords]

    - click the copy icon ![copy-icon] to copy the password to the browsers clipboard for ease of use elsewhere

    <br>

3.  Other actions includes a help/instructions button ![info-icon] and the ability to clear the current list of generated passwords with 'Clear'.

<p align="right">(<a href="#password-generator">back to top</a>)</p>

## Going Forward

Additional features may include:

- Expanding the character base to extended ASCII
- Allow user to enter a password and check it against the Pwned Passwords API

<p align="right">(<a href="#password-generator">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#password-generator">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
[![GitHub][github-shield]][github-url]
[![Project][project-shield]][project-repo]

<p align="right">(<a href="#password-generator">back to top</a>)</p>

[issues-shield]: https://img.shields.io/github/issues/mike-uffelman/password-generator.svg?labelcolor=green
[issues-url]: https://github.com/mike-uffelman/password-generator/issues
[license-shield]: https://img.shields.io/github/license/mike-uffelman/password-generator.svg
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
[info-icon]: images/info.svg
[checked-passwords]: ./images/readMeImgs/password-validation.png
[usage-demo]: ./images/readMeImgs/pw_generator_demo.gif
