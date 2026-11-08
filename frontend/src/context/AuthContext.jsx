import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { setAccessTokenGetter, setAuthCallbacks } from '@/api/client';
import * as authApi from '@/api/auth';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const tokenRef = useRef(null);
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'guest'

    const updateToken = useCallback((token) => {
        tokenRef.current = token;
        setAccessToken(token);
    }, []);

    // Register token getter + interceptor callbacks once
    useEffect(() => {
        setAccessTokenGetter(() => tokenRef.current);
    }, []);

    useEffect(() => {
        setAuthCallbacks({
            onRefreshed: updateToken,
            onFailure: () => {
                tokenRef.current = null;
                setAccessToken(null);
                setUser(null);
                setStatus('guest');
                queryClient.clear(); // ← drop any cached admin data
            },
        });
    }, [updateToken, queryClient]);

    // Restore session on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await authApi.refresh();
                if (cancelled) return;
                updateToken(data.accessToken);
                setUser(data.user);
                setStatus('authenticated');
            } catch {
                if (cancelled) return;
                setStatus('guest');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [updateToken]);

    const signIn = useCallback(
        async (email, password) => {
            const data = await authApi.login({ email, password });
            updateToken(data.accessToken);
            setUser(data.user);
            setStatus('authenticated');
            return data.user;
        },
        [updateToken]
    );

    const signOut = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            /* best-effort */
        }
        tokenRef.current = null;
        setAccessToken(null);
        setUser(null);
        setStatus('guest');
        queryClient.clear(); // ← same
    }, [queryClient]);

    const value = {
        user,
        accessToken,
        status,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}