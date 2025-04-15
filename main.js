/* TO DO LIST [✔]
- complete!
*/

let editor, output, editorSizeInput, outputSizeInput, tooltipCopy, tooltipDownload;
let mostRecentlyUpdatedCode;
let currentLanguageName;
let currentLanguageId;

document.addEventListener('DOMContentLoaded', function () {
    let theme = localStorage.getItem("theme");
    const root = document.documentElement;
    if (theme === null) { // if theme is unsaved in local storage
        localStorage.setItem("theme", "light"); // light by default
        root.classList.add("light-mode");
        document.querySelectorAll("html *").forEach(e => {
            e.classList.add("light-mode");
        });
        document.getElementById("theme-toggle").checked = false; // false = light mode
    } else { // display the last selected theme
        if (theme === "light") {
            root.classList.remove("dark-mode");
            root.classList.add("light-mode");
            document.querySelectorAll("html *").forEach(e => {
                e.classList.remove("dark-mode");
                e.classList.add("light-mode");
            });
            document.getElementById("theme-toggle").checked = false; // false = light mode
        }
        else if (theme === "dark") {
            root.classList.remove("light-mode");
            root.classList.add("dark-mode");
            document.querySelectorAll("html *").forEach(e => {
                e.classList.remove("light-mode");
                e.classList.add("dark-mode");
            });
            document.getElementById("theme-toggle").checked = true; // true = dark mode
        }
    }

    editor = document.getElementById("editor");
    output = document.getElementById("output");
    editorSizeInput = document.getElementById("editor-size-input");
    outputSizeInput = document.getElementById("output-size-input");
    tooltipCopy = document.getElementById("tooltip-copy");
    tooltipDownload = document.getElementById("tooltip-download");

    currentLanguageName = localStorage.getItem('currentLanguage') || "java"; 
    currentLanguageId = getLanguageId(currentLanguageName);
    mostRecentlyUpdatedCode = localStorage.getItem(currentLanguageName + "_code") || getDefaultCode(currentLanguageName);
    document.getElementById("language").value = currentLanguageName;

    // RESIZABLE DIVIDER
    const resizer = document.getElementById('resizer');
    const panelLeft = document.getElementById('editor-container');
    let isMouseDown = false;
    
    resizer.addEventListener('mousedown', onMouseDown);
    
    function onMouseDown(e) {
      isMouseDown = true;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    
    function onMouseMove(e) {
      if (!isMouseDown) return;
    
      const minWidth = 500; // px
      const maxWidth = window.innerWidth - minWidth;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
    
      panelLeft.style.flexBasis = `${newWidth}px`;
    }
    
    function onMouseUp() {
      isMouseDown = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    

});

// localStorage:
// 'currentLanguage' = the language that was most recently chosen
// currentLanguageName + '_code' (e.g. 'java_code') = the most updated saved code for each language

let codeFontSize = 14;
let outputFontSize = 14;
const MAX_FONT_SIZE = 36;
const MIN_FONT_SIZE = 12;

// map name -> id, extension, code
const mapNameToIdExtensionCode = {
    "c": [50, "c", "\/\/ Default C code\n#include <stdio.h>\n\nint main() {\n\tprintf(\"Hello, World!\");\n\treturn 0;\n}"],
    "csharp": [51, "cs", "\/\/ Default C# code\nusing System;\n\nnamespace HelloWorld {\n\tclass Program {\n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine(\"Hello, World!\");\n\t\t}\n\t}\n}"],
    "cpp": [54, "cpp", "\/\/ Default C++ code\n#include <iostream>\nusing namespace std\;\n\nint main() \{\n\tcout << \"Hello, World!\"\;\n\treturn 0\;\n}"],
    "java": [62, "java", "\/\/ Default Java code\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World!\");\n\t}\n}"],
    "javascript": [63, "js", "\/\/ Default JavaScript code\nfunction helloWorld() {\n\tconsole.log(\"Hello, World!\");\n}"],
    "kotlin": [78, "kt", "\/\/ Default Kotlin code\nfun main(args: Array<String>) {\n\tprintln(\"Hello, World!\")\n}"],
    "python": [71, "py", "\# Default Python code\ndef hello_world():\n\tprint(\"Hello, World!\")\n\nhello_world()"],
    "rust": [73, "rs", "\/\/ Default Rust code\nfn main() {\n\tprintln!(\"Hello, World!\");\n}"],
};

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' } });

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("editor"), {
        value: mostRecentlyUpdatedCode,
        language: currentLanguageName,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: codeFontSize,
    });

    editor.onDidChangeModelContent(() => {
        const currentCode = editor.getValue();
        localStorage.setItem(currentLanguageName + "_code", currentCode);
    })

    if (localStorage.getItem("theme") === "light") editor.updateOptions({ theme: "vs-light" });
    else if (localStorage.getItem("theme") === "dark") editor.updateOptions({ theme: "vs-dark" });
});

const backendURL = "https://codepad-sd7b.onrender.com";

async function runCode() {
    const code = editor.getValue();
    const response = await fetch(`${backendURL}/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            source_code: code,
            languageId: currentLanguageId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data); // debugging
        output.innerText = data.stdout || data.stderr || "Error running code."
    })
    .catch(error => {
        console.error("Error sending request:", error); // debugging
    });
}

function resizeCode(element) {
    let action = element.getAttribute("value");
    if (action === "up" && codeFontSize < MAX_FONT_SIZE) codeFontSize++;
    else if (action === "down" && codeFontSize > MIN_FONT_SIZE) codeFontSize--;

    editorSizeInput.value = codeFontSize;
    editor.updateOptions({ fontSize: codeFontSize });
}

function resizeOutput(element) {
    let action = element.getAttribute("value");
    if (action === "up" && outputFontSize < MAX_FONT_SIZE) outputFontSize++;
    else if (action === "down" && outputFontSize > MIN_FONT_SIZE) outputFontSize--;

    outputSizeInput.value = outputFontSize;
    output.style.fontSize = outputFontSize + "px";
}

function editorInputSize() {
    let size = parseInt(editorSizeInput.value);
    if (size <= MAX_FONT_SIZE && size >= MIN_FONT_SIZE) {
        codeFontSize = size;
    }
    else if (size > MAX_FONT_SIZE) {
        codeFontSize = MAX_FONT_SIZE;
        editorSizeInput.value = MAX_FONT_SIZE;
    }
    else if (size < MIN_FONT_SIZE) {
        codeFontSize = MIN_FONT_SIZE;
        editorSizeInput.value = MIN_FONT_SIZE;
    }
    editor.updateOptions({ fontSize: codeFontSize });
}

function outputInputSize() {
    let size = parseInt(outputSizeInput.value);
    if (size <= MAX_FONT_SIZE && size >= MIN_FONT_SIZE) {
        outputFontSize = size;
    }
    else if (size > MAX_FONT_SIZE) {
        outputFontSize = MAX_FONT_SIZE;
        outputSizeInput.value = MAX_FONT_SIZE;
    }
    else if (size < MIN_FONT_SIZE) {
        outputFontSize = MIN_FONT_SIZE;
        outputSizeInput.value = MIN_FONT_SIZE;
    }
    output.style.fontSize = outputFontSize + "px";
}

function downloadCode() {
    if (confirm("Download file?")) {
        const code = editor.getValue();
        const blob = new Blob([code],{ type:"text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Codepad." + getExtension(currentLanguageName);
        a.click();
        URL.revokeObjectURL(url);
    } 
}

function copyCode() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        tooltipCopy.innerText = 'Copied!';
        setTimeout(() => {
            tooltipCopy.innerText = "Copy";
        }, 2000);
    }, () => {
        alert("Error copying code to clipboard.");
    });
}

function resetCode() {
    if (confirm("Reset code to default?"))
    editor.setValue(getDefaultCode(document.getElementById("language").value));
}

function toggleTheme() {
    let theme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (theme === "light") {
        localStorage.setItem("theme", "dark"); // commit to memory
        root.classList.add("dark-mode");
        root.classList.remove("light-mode");
        document.querySelectorAll("html *").forEach(e => {
            e.classList.add("dark-mode");
            e.classList.remove("light-mode");
        });
        editor.updateOptions({ theme: "vs-dark" });
    }
    else if (theme === "dark") {
        localStorage.setItem("theme", "light"); // commit to memory
        root.classList.remove("dark-mode");
        root.classList.add("light-mode");
        document.querySelectorAll("html *").forEach(e => {
            e.classList.remove("dark-mode");
            e.classList.add("light-mode");
        });
        editor.updateOptions({ theme: "vs-light" });
    }

    if (theme === "light") localStorage.setItem("theme", "dark");
    else if (theme === "dark") localStorage.setItem("theme", "light");
}

function changeLanguage() {
    const lang = document.getElementById("language").value;
    currentLanguageName = lang;
    currentLanguageId = getLanguageId(lang); // relay current language to run function
    localStorage.setItem('currentLanguage', lang);

    editor.setValue(localStorage.getItem(currentLanguageName+"_code") || getDefaultCode(lang)); // populate editor with default code
    monaco.editor.setModelLanguage(editor.getModel(), lang); // set editor language
}

function getLanguageId(lang) { return mapNameToIdExtensionCode[lang][0] || null; }
function getExtension(lang) { return mapNameToIdExtensionCode[lang][1] || null; }
function getDefaultCode(lang) { return mapNameToIdExtensionCode[lang][2] || null; }