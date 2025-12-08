import { useEffect } from 'react';
import { type AxiosError } from "axios"
import axios from "axios"
import { useStore } from '@/store';
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://localhost:8080/api"

const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

export const useAxios = () => {
    const { token, removeToken, removeUser } = useStore();
    const navigate = useNavigate()

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responeIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    removeToken();
                    removeUser();
                    navigate("/")
                    return new Promise(() => { });
                }
                return Promise.reject(error.response?.data);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responeIntercept);
        }
    }, [token])

    useEffect(() => {
        const responeIntercept = axiosPublic.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                return Promise.reject(error.response?.data);
            }
        );

        return () => {
            axiosPublic.interceptors.response.eject(responeIntercept);
        }
    }, [])

    return { axiosPublic, axiosPrivate };
}