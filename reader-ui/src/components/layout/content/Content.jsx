
import { Layout } from "antd"
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

const { Content: AntdContent } = Layout

export default function Content({ children }) {

    return <AntdContent>
        <OverlayScrollbarsComponent
            options={{
                scrollbars: {
                    autoHide: 'scroll',
                }
            }}
            defer
        >
            {children}
        </OverlayScrollbarsComponent>
    </AntdContent>

}