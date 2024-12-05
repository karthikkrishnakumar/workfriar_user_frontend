import Axios, { AxiosRequestConfig } from "axios";

const axiosClient = Axios.create({
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

const http = () => {

  // post method 
  const post = async (
    url: string,
    props?: JSON | FormData | {},
    hasFile?: boolean
  ) => {
    let config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (hasFile) {
      config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
    }

    const response = await axiosClient
      .post(url, props, config)
      .then((response) => {
        if (response.data == undefined || response.data == "") {
          response.data = {
            status: false,
            message: "Something went wrong.",
          };
        }
        return response;
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          error.response.data.status = false;
          return error.response;
        } else if (error.response) {
          error.response.data = {
            status: false,
            message: "Something went wrong.",
          };
          return error.response;
        } else {
          return {
            data: {
              status: false,
              message: "Something went wrong.",
            },
          };
        }
      });

    const body = response.data;
    return { response, body };
  };

  // get method
  const get = async (
    url: string, 
    params?: Record<string,
    any>
  ) => {
    const config: AxiosRequestConfig = {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosClient
      .get(url, config)
      .then((response) => {
        if (response.data == undefined || response.data == "") {
          response.data = {
            status: false,
            message: "Something went wrong.",
          };
        }
        return response;
      })
      .catch((error) => {
        if (error.response) {
          error.response.data = {
            status: false,
            message: "Something went wrong.",
          };
          return error.response;
        } else {
          return {
            data: {
              status: false,
              message: "Something went wrong.",
            },
          };
        }
      });

    const body = response.data;
    return { response, body };
  };

  return { post, get };
};

export default http;
