import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/database";

export const useListingApplications = (listingId: string) => {
  return useQuery({
    queryKey: ["listing-applications", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!listingId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing-applications"] });
    },
  });
};

export const useMarkListingCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from("listings")
        .update({ is_completed: true, is_active: false })
        .eq("id", listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
};

export const useMyListings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["my-listings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          organizations (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
