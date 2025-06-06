import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
    //prettier-ignore
    "Accept": "application/json",
  },
});
const APIWITHTOKEN = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
    //prettier-ignore
    "Accept": "application/json",
    Authorization: localStorage.getItem("usertoken"),
  },
});
export { API, APIWITHTOKEN };
