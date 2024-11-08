import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const OAuth2Redirect = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [queryParams] = useSearchParams();

    useEffect(() => {
        const token = queryParams.get('token');
        const redirectPath = queryParams.get('redirectPath');

        if (token) {
            const decodedToken = jwtDecode(token);
            login(token);  // AuthContext의 login 함수 호출

            if (redirectPath === '/main') {
                // 이미 등록된 사용자인 경우
                navigate('/main', { replace: true });
            } else if (redirectPath === '/firstLogin') {
                // 새 사용자인 경우
                const params = new URLSearchParams(queryParams);
                navigate(`/firstLogin?${params.toString()}`, { replace: true });
            } else {
                // 예상치 못한 경로인 경우
                navigate('/login', { replace: true });
            }
        } else {
            // 토큰이 없는 경우
            navigate('/login', { replace: true });
        }
    }, [queryParams, navigate, login]);

    return null;
};

export default OAuth2Redirect;