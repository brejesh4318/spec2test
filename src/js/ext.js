const BASE_URL = "http://localhost:3000";

export const extCommon = {
  get: (url) => {
    const requestOptions = {
      method: "GET",
      headers: getHeaders(),
    };
    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },

  post: (url, body) => {
    const requestOptions = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    };
    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },

  postFile: (url, body) => {
    var hdrs = getHeaders();
    delete hdrs["Content-Type"]; // important for FormData
    const requestOptions = {
      method: "POST",
      headers: hdrs,
      body,
    };
    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },

  upload: (url, fields = {}, files = []) => {
    const formData = new FormData();

    // add text fields
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // add files (single or multiple)
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append("files", file));
    } else if (files) {
      formData.append("files", files);
    }

    const hdrs = getHeaders(true); // ✅ skip JSON content-type, keep auth headers

    const requestOptions = {
      method: "POST",
      headers: hdrs,
      body: formData,
    };

    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },

  oAuth: (url, body) => {
    const requestOptions = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    };
    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },

  put: (url, body) => {
    const requestOptions = {
      method: "PUT",
      headers: getHeaders(),
      body,
    };
    return fetch(`${BASE_URL}${url}`, requestOptions).then(handleResponse);
  },
};


function getHeaders(isFileUpload = false) {
    const sid = sessionStorage.getItem('social')
    const hdrs = {}
    if (sid) { hdrs['x-auth'] = sid }
    hdrs['x-dt'] = new Date()
    hdrs['x-tz'] = new Date().getTimezoneOffset()

    if (!isFileUpload) {
        hdrs['Content-Type'] = 'application/json; charset=utf-8'
    }

    return hdrs
}

function handleResponse(response) {
    // if (!response.headers.has("x-auth")) {
    //     console.error("auth failed")
    //     return
    // };
    console.log(response,"response")
    return response;
}
