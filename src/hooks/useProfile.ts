import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateProfileName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("last_name_change")
        .eq("user_id", userId)
        .single();

      if (profile?.last_name_change) {
        const lastChange = new Date(profile.last_name_change);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        if (lastChange > twoWeeksAgo) {
          const nextAllowed = new Date(lastChange);
          nextAllowed.setDate(nextAllowed.getDate() + 14);
          const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          throw new Error(`Vārdu var mainīt tikai reizi 2 nedēļās. Nākamā maiņa iespējama pēc ${daysLeft} dienām.`);
        }
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, last_name_change: new Date().toISOString() })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
    },
  });
};
