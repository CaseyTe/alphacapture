import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { LogIn, LogOut, User } from "lucide-react";
import { SearchHeader } from "./SearchHeader";

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch the current user on component mount
    const currentUser = supabase!.auth.getUser();
    setUser(currentUser);

    // Listen for auth state changes
    const { data: authListener } = supabase!.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in:", error);
      // TODO: Add error toast notification
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error logging out:", error);
      // TODO: Add error toast notification
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <User className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 font-bold text-xl text-indigo-600">
              MeetingApp
            </span>
          </div>
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
