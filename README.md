# Codepad

## 🚀 Introduction

Codepad is an online code editor and compiler which implements:

- support for the most widely-used programming languages
- custom formatting options for code editor and output console
- dark mode and light mode support
- copy and download functionalities

APIs used are Judge0 CE from RapidAPI and Monaco Editor.

Languages used are JavaScript, HTML and CSS.

## 🌐 Live Site
To test out Codepad, visit https://maximus-teo.github.io/codepad

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