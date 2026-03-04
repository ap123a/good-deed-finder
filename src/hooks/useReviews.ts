import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review, ReviewWithProfile } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

export const useOrganizationReviews = (organizationId: string) => {
  return useQuery({
    queryKey: ["reviews", "organization", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_user_id_fkey(full_name, avatar_url)")
        .eq("organization_id", organizationId)
        .eq("review_type", "organization")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as ReviewWithProfile[];
    },
    enabled: !!organizationId,
  });
};

export const useListingReviews = (listingId: string) => {
  return useQuery({
    queryKey: ["reviews", "listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!listingId,
  });
};

export const useVolunteerReviews = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", "volunteer", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_user_id_fkey(full_name, avatar_url)")
        .eq("reviewed_user_id", userId)
        .eq("review_type", "volunteer")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as ReviewWithProfile[];
    },
    enabled: !!userId,
  });
};

export const useOrganizationStats = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-stats", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("organization_id", organizationId)
        .eq("review_type", "organization");

      if (error) throw error;

      if (!data || data.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        averageRating: Math.round((sum / data.length) * 10) / 10,
        reviewCount: data.length,
      };
    },
    enabled: !!organizationId,
  });
};

export const useVolunteerStats = (userId: string) => {
  return useQuery({
    queryKey: ["volunteer-stats", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewed_user_id", userId)
        .eq("review_type", "volunteer");

      if (error) throw error;

      if (!data || data.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        averageRating: Math.round((sum / data.length) * 10) / 10,
        reviewCount: data.length,
      };
    },
    enabled: !!userId,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      organization_id: string;
      listing_id?: string;
      rating: number;
      comment?: string;
      review_type?: string;
      reviewed_user_id?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          organization_id: params.organization_id,
          listing_id: params.listing_id || null,
          user_id: user.id,
          rating: params.rating,
          comment: params.comment || null,
          review_type: params.review_type || "organization",
          reviewed_user_id: params.reviewed_user_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["organization-stats", variables.organization_id] });
      if (variables.reviewed_user_id) {
        queryClient.invalidateQueries({ queryKey: ["volunteer-stats", variables.reviewed_user_id] });
      }
    },
  });
};
