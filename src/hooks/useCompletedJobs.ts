import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCompletedJobsCount = (userId: string) => {
  return useQuery({
    queryKey: ["completed-jobs", userId],
    queryFn: async () => {
      // Count applications with "approved" status where the listing is completed
      const { count, error } = await supabase
        .from("applications")
        .select("id, listings!inner(is_completed)", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "approved")
        .eq("listings.is_completed", true);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
  });
};
