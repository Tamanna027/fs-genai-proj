import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            console.log("LOGIN RESPONSE:", data);

            setUser(data.user);

            return data;
        } catch (err) {
            console.log("LOGIN ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);

        try {
            const data = await register({
                username,
                email,
                password
            });

            setUser(data.user);

            return data;
        } catch (err) {
            console.log("REGISTER ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlelogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.log("LOGOUT ERROR:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const getAndSetUser = async() =>{
            try{
                const data = await getMe()
                setUser(data.user)
            }catch(err){ 
            }finally{
                setLoading(false)
            }
            
        }
        getAndSetUser()
    },[])

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handlelogout
    };
};