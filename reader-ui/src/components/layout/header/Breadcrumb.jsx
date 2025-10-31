import { Breadcrumb } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'


import { MENU_TYPE } from '../../../constants/menu'
import { useAuthNavigation } from '@/hooks/useAuthNavigation'
import { useUserStore } from '@/stores/userStore'
import { findNodePathByFlat } from '@/utils/array'

export default function Breadcrumb() {
    const location = useLocation()
    const { t } = useTranslation()
    const { flatUserMenus } = useUserStore()
    const { matchedMenuPath } = useAuthNavigation()
    const breadcrumbItems = useMemo(() => {
        const menuPath = findNodePathByFlat(
            flatUserMenus,
            menu => menu.path === matchedMenuPath,
        )
        if (location.pathname !== matchedMenuPath) {
            const remainingPath = location.pathname.slice(matchedMenuPath.length)

            if (remainingPath.includes('/create')) {
                menuPath.push({
                    id: -1,
                    parentId: null,
                    title: t('common.create'),
                    icon: '',
                    type: MENU_TYPE.MENU,
                })
            }
            else if (remainingPath.includes('/edit')) {
                menuPath.push({
                    id: -1,
                    parentId: null,
                    title: t('common.edit'),
                    icon: '',
                    type: MENU_TYPE.MENU,
                })
            }


        }

        return menuPath.map((item) => {
            const title = item.i18nKey ? t(item.i18nKey) : item.title

            return {
                title: item.path && item.path !== location.pathname ? <Link to={item.path} viewTransition>{title}</Link> : title,
            }
        })
    }, [flatUserMenus, matchedMenuPath, location.pathname, t])





    return (
        <Breadcrumb items={breadcrumbItems} />
    )
}