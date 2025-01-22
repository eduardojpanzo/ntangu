import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/fecth";
import { ProfileModel } from "@/models/profile.model";
import { createSession, deleteSession, getSession } from "@/utils/session";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextProps {
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  profile: ProfileModel | null;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileModel | null>(null);

  const fecthProfile = async () => {
    try {
      const session = await getSession();

      if (!session?.token) {
        toast({
          title: "Credências não validadas",
          description: "faça o ínicio de sessão!",
          variant: "destructive",
        });
        logout();
        return;
      }

      const response = await api(ProfileModel.ENDPOINT);

      if (response.status === 401) {
        toast({
          title: "Credências não validadas",
          description: "faça o ínicio de sessão!",
          variant: "destructive",
        });
        deleteSession();
        navigate(`/login`);
        return;
      }
      const data: HttpResponseDataType<ProfileModel> = await response.json();
      setProfile(data.data);
      setToken(session.token);
      return data.data;
    } catch {
      setToken(null);
      toast({
        title: "Credências não validadas",
        description: "faça o ínicio de sessão!",
        variant: "destructive",
      });

      logout();
    }
  };

  const login = async (email: string, senha: string) => {
    const response = await api("/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    const responseData: HttpResponseDataType<LoginResponse> =
      await response.json();

    await createSession(email, responseData.data.token);

    setToken(token);
  };

  const logout = () => {
    deleteSession();
    navigate(`/`);
  };

  useQuery({
    queryKey: ["profile-data"],
    queryFn: fecthProfile,
  });

  return (
    <AuthContext.Provider value={{ login, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};
