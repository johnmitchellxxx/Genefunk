import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  useGetCharacters, 
  useCreateCharacter, 
  useGetCharacter, 
  useUpdateCharacter, 
  useDeleteCharacter,
  useGetTrashedCharacters,
  useRestoreCharacter,
  usePermanentlyDeleteCharacter,
  getGetCharactersQueryKey,
  getGetTrashedCharactersQueryKey,
  getGetCharacterQueryKey,
  useGetCurrentAuthUser,
  useGetRulebookClasses,
  useGetRulebookBackgrounds,
  useGetRulebookGenomes,
  useGetRulebookCadres,
} from "@workspace/api-client-react";

export function useAppAuth() {
  return useGetCurrentAuthUser({
    request: { credentials: "include" },
    query: { retry: false, refetchOnWindowFocus: false }
  });
}

export function useAppCharacters() {
  return useGetCharacters({
    request: { credentials: "include" }
  });
}

export function useAppCharacter(id: number) {
  return useGetCharacter(id, {
    request: { credentials: "include" }
  });
}

export function useAppCreateCharacter() {
  const queryClient = useQueryClient();
  const mutation = useCreateCharacter({ request: { credentials: "include" }});
  
  return {
    ...mutation,
    mutate: (variables: any, options?: any) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data, vars, context) => {
          queryClient.invalidateQueries({ queryKey: getGetCharactersQueryKey() });
          if (options?.onSuccess) options.onSuccess(data, vars, context);
        }
      });
    }
  };
}

export function useAppUpdateCharacter() {
  const queryClient = useQueryClient();
  const mutation = useUpdateCharacter({ request: { credentials: "include" }});
  
  return {
    ...mutation,
    mutate: (variables: { id: number, data: any }, options?: any) => {
      // Optimistic update
      const prev = queryClient.getQueryData(getGetCharacterQueryKey(variables.id));
      queryClient.setQueryData(getGetCharacterQueryKey(variables.id), (old: any) => ({
        ...old,
        ...variables.data
      }));

      mutation.mutate(variables, {
        ...options,
        onError: (err, vars, context) => {
          queryClient.setQueryData(getGetCharacterQueryKey(vars.id), prev);
          if (options?.onError) options.onError(err, vars, context);
        },
        onSettled: (data, err, vars, context) => {
          queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey(vars.id) });
          queryClient.invalidateQueries({ queryKey: getGetCharactersQueryKey() });
          if (options?.onSettled) options.onSettled(data, err, vars, context);
        }
      });
    }
  };
}

const rulebookQueryOptions = {
  query: { staleTime: Infinity, refetchOnWindowFocus: false },
};

export function useAppRulebookClasses() {
  return useGetRulebookClasses(rulebookQueryOptions);
}

export function useAppRulebookBackgrounds() {
  return useGetRulebookBackgrounds(rulebookQueryOptions);
}

export function useAppRulebookGenomes() {
  return useGetRulebookGenomes(rulebookQueryOptions);
}

export function useAppRulebookCadres() {
  return useGetRulebookCadres(rulebookQueryOptions);
}

export function useAppDeleteCharacter() {
  const queryClient = useQueryClient();
  const mutation = useDeleteCharacter({ request: { credentials: "include" }});
  
  return {
    ...mutation,
    mutate: (variables: { id: number }, options?: any) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data, vars, context) => {
          queryClient.invalidateQueries({ queryKey: getGetCharactersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTrashedCharactersQueryKey() });
          if (options?.onSuccess) options.onSuccess(data, vars, context);
        }
      });
    }
  };
}

export function useAppTrashedCharacters() {
  return useGetTrashedCharacters({
    request: { credentials: "include" },
    query: { retry: false }
  });
}

export function useAppRestoreCharacter() {
  const queryClient = useQueryClient();
  const mutation = useRestoreCharacter({ request: { credentials: "include" } });
  return {
    ...mutation,
    mutate: (variables: { id: number }, options?: any) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data: unknown, vars: unknown, context: unknown) => {
          queryClient.invalidateQueries({ queryKey: getGetCharactersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTrashedCharactersQueryKey() });
          if (options?.onSuccess) options.onSuccess(data, vars, context);
        }
      });
    }
  };
}

export function useAppPermanentlyDeleteCharacter() {
  const queryClient = useQueryClient();
  const mutation = usePermanentlyDeleteCharacter({ request: { credentials: "include" } });
  return {
    ...mutation,
    mutate: (variables: { id: number }, options?: any) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data: unknown, vars: unknown, context: unknown) => {
          queryClient.invalidateQueries({ queryKey: getGetTrashedCharactersQueryKey() });
          if (options?.onSuccess) options.onSuccess(data, vars, context);
        }
      });
    }
  };
}

export function useAppBackupNow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/characters/backup', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any).error ?? `HTTP ${res.status}`);
      }
      return res.json() as Promise<{ success: boolean; created: number; skipped: number }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetTrashedCharactersQueryKey() });
    },
  });
}
