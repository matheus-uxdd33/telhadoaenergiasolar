import { create } from "zustand";
import { User } from "../types";
import { supabase } from "../database/supabase";
import toast from "react-hot-toast";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  initialize: () => void;
  signUpWithWhatsApp: (email: string, pass: string, name: string, phone: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error: any) {
      toast.error(error.message || "Erro ao sair");
    }
  },

  signUpWithWhatsApp: async (email, password, name, phone) => {
    try {
      // 1. Sign up user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            tenant_id: "tenant-demo",
            plan_code: "emergency_7d",
            plan_status: "trial"
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Falha ao criar o usuário.");

      // 2. Insert into public.profiles
      // Using upsert to handle potential race conditions or existing profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: name,
          whatsapp: phone
        });

      if (profileError) {
        console.error("Erro ao salvar perfil: ", profileError.message);
        // We don't throw here to not break the signup flow if auth succeeded
      }
      
      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro no cadastro");
      throw error;
    }
  },

  initialize: () => {
    // Listen to Auth State Changes - This is the "Regra de Ouro"
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
          tenantId: session.user.user_metadata?.tenant_id || "tenant-demo",
          planCode: session.user.user_metadata?.plan_code || "emergency_7d",
          planStatus: session.user.user_metadata?.plan_status || "trial",
          features: []
        };
        set({ user: u, token: session.access_token, isAuthenticated: true });
      } else {
        set({ user: null, token: null, isAuthenticated: false });
      }
    });

    // Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
          tenantId: session.user.user_metadata?.tenant_id || "tenant-demo",
          planCode: session.user.user_metadata?.plan_code || "emergency_7d",
          planStatus: session.user.user_metadata?.plan_status || "trial",
          features: []
        };
        set({ user: u, token: session.access_token, isAuthenticated: true });
      }
    });
  }
}));
