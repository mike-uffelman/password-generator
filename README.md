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

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#considerations">Considerations</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]]('./images/readme-main.png')

This password generator is designed to output complex and safe passwords to meet common password requirements. The generator allows for passwords of up to 64 characters and a combination of many character types including the lowercase and uppercase alphabet (A to Z), special characters (ASCII up to #126) or user defined special characters, and numbers (0 - 9).

Additional features include the ability to copy passwords to the browser clipboard on click and check the generated passwords' vulnerability (i.e. if it has been compromised in a data breach) against the pwnedpasswords API database.

<hr>
During execution of generating the password the app will:

- ensure at least one (1) character of each required type will be in the password

Upon output the app will print the password to the 'Generated Passwords' list where the user can view the generated password.

Once the generated password is available the user will be able to copy the password to the browser clipboard for ease of use elsewhere.

Most importantly, the user will be able to click the shield search icon which will hash the password and compare the hash to a list of compromised passwords via the pwnedpassword API.

This is a password generator app. The project started with simplier functionality such as password length and choosing the number of special characters and digits (if any) the user required. Over time the scope and functionality expanded to includes more features

The features included in the app include:

- User selection of the password length (2-64 characters), lowercase A-Z, uppercase A-Z, Special Characters or specific user defined Special Characters, and numbers (0-9)
- Upon selection of the password parameters, the app will generate the password and check to ensure at least one character for each specified character type is included in the returned password.
- Once displayed in the 'Generated Passwords' list, the user may click the icon with the shield and search to verify the password has not been compromised in any data breaches (as tracked by the pwnedpassword API).
- The user may also copy the password to the browser clipboard by clicking the copy icon.

Pw length, lowercase, uppercase, special characters, specific special characters, and numbers.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- JavaScript
- [Bootstrap](https://getbootstrap.com)
- Pwned Passwords API

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Open the [live demo here](link).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

The basic usage process is as follows:

1.  User shall populate the form to the desired password conditions
    <br>
    [![Password Generator form screenshot][form-screenshot]]('./images/form.png')

2.  Upon output of the generated password the user may:
    [![Password Generator ouput screenshot][item-screenshot]]('./images/pwItem.png')

        - click the icon with a shield and search glass which will compare the generated password to the pwnedpassword API database of compromised password
        - click the copy icon to copy the password to the browsers clipboard for ease of use elsewhere

    <br>
    <br>
    [![Password Generator icons screenshot][icons-screenshot]]('./images/icons.png')

<br>

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

## Considerations

\*Should not be considered secure...

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
[product-screenshot]: images/readme-main.png
[form-screenshot]: images/form.png
[item-screenshot]: images/pwItem.png
[icons-screenshot]: images/icons.png
[github-url]: https://github.com/mike-uffelman
[github-shield]: https://img.shields.io/badge/GitHub-profle-orange
[project-shield]: https://img.shields.io/badge/GitHub-repo-gray?color=#6cc644
[project-repo]: https://github.com/mike-uffelman/password-generator
