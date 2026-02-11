import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000"
})

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (config.url?.includes("/auth/logout") && refreshToken) {
        config.headers.Authorization = `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${refreshToken}`;
    } else if (accessToken) {
        config.headers.Authorization = `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status == 401 && !originalRequest._retry) {

            originalRequest._retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if (!refreshToken) {
                console.warn("No refresh token found")
                return Promise.reject(error)
            }

            try {
                const res = await api.post("/auth/refresh-token", {
                    refreshToken: `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${refreshToken}`
                })

                const newAccessToken = res.data.data.access_token
                const newRefreshToken = res.data.data.refresh_token

                localStorage.setItem("accessToken", newAccessToken)
                localStorage.setItem("refreshToken", newRefreshToken)

                originalRequest.headers.authorization = `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${newAccessToken}`;
                return api(originalRequest);

            } catch (error) {
                console.error("Please Login Again")
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default api