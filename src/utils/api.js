import axios from "axios";

export const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com/",
  headers: {
    "Accept-Version": "v1",
    Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_API_ACCESS_KEY}`
  }
});

const DEFAULT_PARAMS = { per_page: 15 };

export function fetchImages(params) {
  return unsplashApi.get("/photos", {
    params: Object.assign({}, DEFAULT_PARAMS, params)
  });
}
