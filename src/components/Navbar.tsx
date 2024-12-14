import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { LogIn, LogOut } from "lucide-react";
import { SearchHeader } from "./SearchHeader";
import { useMeetingStore } from "../store/useMeetingStore";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const { login, logout } = useMeetingStore();

  useEffect(() => {
    // Fetch the current user on component mount
    const fetchUser = async () => {
      const { data, error } = await supabase!.auth.getUser();
      if (data.user) {
        setUser(data.user);
        login(data.user.id);
      }
      if (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase!.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          login(session.user.id);
        } else {
          setUser(null);
          logout();
        }
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [login, logout]);

  const handleLogin = async () => {
    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

      // No need to set user here; the auth state listener will handle it
    } catch (error) {
      console.error("Error logging in:", error);
      // TODO: Add error toast notification
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;

      // No need to set user here; the auth state listener will handle it
    } catch (error) {
      console.error("Error logging out:", error);
      // TODO: Add error toast notification
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <FileText className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800">
              AlphaCapture
            </span>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <SearchHeader />
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
