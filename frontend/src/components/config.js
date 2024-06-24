const API_BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const API_COMPILER_URL = `${import.meta.env.VITE_COMPILER_URL}`;
//API_BACKEND_URL='http://localhost:5000'
//API_COMPILER_URL='http://localhost:8000'
console.log(API_BACKEND_URL);

export { API_BACKEND_URL ,API_COMPILER_URL};