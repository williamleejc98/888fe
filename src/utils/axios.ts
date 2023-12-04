import { HttpError } from "@refinedev/core";
import axios from "axios";
import { authProvider } from "../authProvider";

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Unauthorized, log out the user
            await authProvider.logout({});        }
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);

export { axiosInstance };
