<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->







<!-- PROJECT LOGO -->
<br />


## Table of Contents
- [Features](#features)
- [Demo Video](#demo-video)
- [About Project](#about-the-project)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Prerequisites](#Prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Features
- User Authentication
  - Registration
  - Login
  - Logout
- User Authorization
  - Two types of Users- Admin and User
  - Different rendering for each type
- Problem Management
  - Add/Edit/Delete Problems
  - Problem Set list
  - Problem Description
  - Testcase Management Read/Add/Delete/Update Testcases
- Code Submission and Evaluation
  - Support for multiple languages (C, C++, Python)
  - Code Compilation
  - Code Execution
  - Test Case Validation
  - Isolation Achieved using Docker
- Submission Verdict
  - View All Submissions of a Problem
- Profile Page
  - User Details
  - Profile Photo
- User List
  - Admin access to switch roles

## Demo Video

[Watch the demo video](https://www.loom.com/share/d2939811b1a54a56a01850a347d01f58?sid=22ae5e18-14e0-4d4f-997c-99b45a3221e9)

*Click the link to watch the demo video*
## About The Project


This web application, built using the MERN stack (MongoDB, Express, React, and Node.js), serves as an online judge for algorithm questions. It enables users to practice programming by solving algorithmic challenges. The platform compiles and executes code, testing it against pre-constructed TestCases. 

This application also assigns each user the ability to view their submissions, upload images to their profile section. This platform fosters a community where users can explore each other's profiles and submissions. Additionally, it grants administrators the capability to create and edit problems along with their associated test cases. Currently, it supports four languages: C,C++,Java and Python.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Technologies Used

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.


* [![React][React.js]][React-url]
* ![Node.js](https://nodejs.org/static/images/logo.svg)
- Node.js

![Express.js](https://expressjs.com/images/express-facebook-share.png)
- Express.js

![MongoDB](https://webassets.mongodb.com/_com_assets/cms/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png)
- MongoDB

![Docker](https://pbs.twimg.com/profile_images/1749553035133566976/hMA0FbDk_400x400.jpg)
- Docker
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.



### Prerequisites

Make sure you have the following software installed on your local machine:
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) (Optional, for running the judge in a containerized environment)

  

### Installation


1. **Clone the repository**
    ```bash
    git clone https://github.com/aryankes/Online-Judge-Project.git
    cd Online-Judge
    ```

2. **Install backend dependencies**
    ```bash
    cd ./backend
    npm install
    ```

3. **Install frontend dependencies**
    ```bash
    cd ./frontend
    npm install
    ```

4. **Install compiler dependencies**
    ```bash
    cd ./compiler
    npm install
    ```

5. **Set up environment variables**
    Create a `.env` file in the `backend` directory and add your configuration details:
    ```
    MONGO_URI=Your_mongo_DB_link
    PORT=5000
    SECRET_KEY =your_secret_key
    CookieSecret=your_secret
    INSTANCE_IP=yourInstanceIp(If pushing to aws else use "http://localhost")
    ```

6. **Set up environment variables**
    Create a `.env` file in the `frontend` directory and add your configuration details:
    ```env
    VITE_REACT_INSTANCE_IP=yourInstanceIp(If pushing to aws else use "http://localhost")
    ```

7. **Start the backend server**
    ```bash
    cd ./backend
    nodemon index.js
    ```

8. **Start the frontend server**
    ```bash
    cd ./frontend
    npm run dev
    ```

9. **Start the compiler server**
    ```bash
    cd ./compiler
    nodemon index.js
    ``````

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Once the installation is complete, you can start using the platform by navigating to `http://localhost:5173` in your web browser.

- **Login**: Login to your account.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/login_page.png)
- **Register Page**: Create a new account.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/register_page.png)
- **Homepage(admin)**:
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/home_page_top.png)
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/home_page_bottom.png)
- **ProblemSet(admin)**: Page Listing all the available problems.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/problem_set_admin.png)
- **ProblemDescription**: Page Describing the Problem.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/problem_page_top.png)
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/problem_page_bottom.png)
- **Submissions**: Page Listing all user submissions.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/problem_submissions.png)
- **Userlist**: Page Listing the users(only visible for admin).
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/users_page_admin.png)
- **Profile**: Profile Page of users.
![Register](https://github.com/Pranavsai0407/Online-Judge/blob/main/images/Online-judge-images/profile_page.png)

Role respective crud functionality has also been provided

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Project Structure

```plaintext
├── backend/
│   ├── controllers/
│   ├── databases/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── Dockerfile
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env
│   ├── Dockerfile
│   ├── index.html
│   ├── .eslintrc.cjs
│   ├── vite.config.js
│   └── package.json
├── Compiler/
│   ├── index.js
│   ├── executeJava.js
│   ├── executeCpp.js
│   ├── executeC.js
│   ├── executePython.js
│   ├── generaterFile.js
│   ├── generateInputFile.js
│   ├── Dockerfile
│   └── package.json
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

PADAMATI PRANAV SAI -  pranavsaipadamati@gmail.com

Project Link: [https://github.com/Pranavsai0407/Online-Judge](https://github.com/Pranavsai0407/Online-Judge)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
