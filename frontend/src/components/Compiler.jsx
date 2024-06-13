import React, { useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import './Compiler.css';

function Compiler() {
  const [code, setCode] = useState(``);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      input
    };
    try {
      const { data } = await axios.post('http://localhost:8000/run', payload);
      console.log(data);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
    }
  }

  const getLanguageExtension = (language) => {
    switch(language) {
      case 'c':
      case 'cpp':
        return cpp();
      case 'java':
        return java();
      case 'python':
        return python();
      default:
        return cpp();
    }
  }

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><a href="/Compiler">Custom Test</a></li>
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
          </ul>
        </nav>
      </header>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Custom Test</h1>
        <div className="container mx-auto flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 px-4">
          <div className="flex-1">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Editor</h2>
              <div className="mb-4">
                <label className="mr-2">Language:</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border border-gray-300 rounded-md p-2">
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div className="mb-4">
                <CodeMirror
                  value={code}
                  height="50vh"
                  extensions={[getLanguageExtension(language)]}
                  placeholder="Type your Code Here"
                  theme={oneDark}
                  onChange={(value) => setCode(value)}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="run-button py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
              >
                Run
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-8">
            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-semibold mb-4">Input</h2>
              <textarea
                rows="5"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-indigo-500 resize-none h-full"
              />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-semibold mb-4">Output</h2>
              <div className="bg-gray-100 p-4 rounded-md text-gray-800 font-mono whitespace-pre-wrap h-full">{output.stdout}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Compiler;
