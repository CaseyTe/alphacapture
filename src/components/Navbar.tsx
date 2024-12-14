import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { LogIn, User, Search } from "lucide-react";
import { UserMenu } from "./navigation/UserMenu";

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
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
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meetings..."
                  className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
          <div className="flex items-center">
            {!user && (
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
