import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationData {
  listing_id: string;
  phone?: string;
  motivation: string;
  cv_url?: string;
}

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ApplicationData) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Lai pieteiktos, nepieciešams pieslēgties");
      }

      // Get user profile for full_name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      const applicationData = {
        ...data,
        user_id: user.id,
        full_name: profile?.full_name || user.email?.split("@")[0] || "Lietotājs",
        email: user.email || "",
        status: "pending",
      };

      const { data: result, error } = await supabase
        .from("applications")
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
};

export const useMyApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          listings (
            id,
            title,
            location,
            time_commitment,
            organizations (
              id,
              name
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
