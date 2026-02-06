import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationData {
  listing_id: string;
  full_name: string;
  email: string;
  phone?: string;
  motivation: string;
  cv_url?: string;
}

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ApplicationData) => {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Lai pieteiktos, nepieciešams pieslēgties");
      }

      const applicationData = {
        ...data,
        user_id: user.id,
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
    },
  });
};
