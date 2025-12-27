import React, {createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 👈 NEW: Add loading state

    useEffect(() => {
        console.log("🔍 Checking localStorage for saved user...");
        
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                console.log("✅ User loaded from localStorage:", parsedUser);
            } catch (error) {
                console.error("❌ Error parsing saved user:", error);
                localStorage.removeItem("user");
            }
        } else {
            console.log("ℹ️ No user found in localStorage");
        }
        
        setLoading(false); // 👈 Done loading!
        console.log("✅ AuthProvider ready!");
    }, []);

    const login = (userData) => {
        console.log("🔐 Logging in user:", userData);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("💾 Saved to localStorage");
    }

    const logout = () => {
        console.log("🚪 Logging out user:", user);
        setUser(null);
        localStorage.removeItem("user");
        console.log("🗑️ Removed from localStorage");
    }

    // 👇 Don't render children until loading is done
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}