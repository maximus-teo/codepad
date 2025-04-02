# Codepad

## Introduction
Codepad is a web-based code editor and compiler that supports multiple programming languages. It provides a clean and customisable interface for writing, formatting, and executing code directly in your browser (*Chrome, Firefox, Opera, and Safari supported*).

## 🌐 Live Site
To test out Codepad, visit https://maximus-teo.github.io/codepad

## Features
+ Multi-language support – Compile and run code in various widely-used programming languages.
+ Customisable editor & console – Modify font size in editor settings and output display.
+ Dark & light mode – Switch between themes for comfortable viewing.
+ Code management – Easily copy or download code snippets for later use.

## Tech Stack
+ **Frontend**: Built with HTML, CSS, and JavaScript, using Monaco Editor.
+ **Backend**: Powered by Judge0 CE via RapidAPI to handle code compilation and execution. The backend logic is hosted on Render for API communication.

## Deployment
Frontend deployed using GitHub Pages, backend using Render for API handling.

## Usage
1. Select a programming language from the dropdown menu.
2. Write or paste your code into the editor.
3. Click Run to compile and execute the code.
4. View the output in the console below.

## 📌 How to Run Locally
Here are the steps to run this program on your machine, with your own API key.

1. **Clone this repository**:
   ```
   git clone https://github.com/maximus-teo/codepad.git
   cd codepad
   ```

2. **Create a `.env` file** in the root of your project.

3. **Add your API key to the `.env` file**: <br />
    You will need a working API key to run this editor. To get your API key, visit the Judge0 CE page on RapidAPI:
    https://rapidapi.com/judge0-official/api/judge0-ce

    Go to your `.env` file and add your API key as shown.
    ```
    API_KEY=your-api-key-here
    ```

4. **Run the project in terminal**:
    Make sure the directory is set to the `codepad` folder, then run `npm start`.
    ```
    cd codepad
    npm start
    ```

~ Designed and developed by Maximus Teo