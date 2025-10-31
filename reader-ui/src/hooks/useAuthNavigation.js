import { useMemo } from 'react'
import { useLocation, useMatches, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'


export function useAuthNavigation() {
    const navigate = useNavigate()
    const location = useLocation()
    const matches = useMatches()




    return {
        login,
        logout,
        matchedMenuPath,
    }
}