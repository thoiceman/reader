// Ant Design 组件按需导入工具
// 在 Ant Design 5 中，默认支持 Tree Shaking，无需额外配置
// 但我们可以创建统一的导入入口来管理常用组件

// 布局组件
import { Layout } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

export {
  Layout,
  Header,
  Content,
  Footer,
  Sider,
};

// 导航组件
export {
  Menu,
  Breadcrumb,
  Pagination,
  Steps,
} from 'antd';

// 数据录入组件
export {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Slider,
  Rate,
  Checkbox,
  Radio,
  InputNumber,
  TreeSelect,
  Cascader,
  AutoComplete,
} from 'antd';

// 数据展示组件
export {
  Table,
  Tag,
  Progress,
  Tree,
  Tooltip,
  Popover,
  Badge,
  Avatar,
  Card,
  Carousel,
  Collapse,
  List,
  Tabs,
  Calendar,
  Image,
  Statistic,
  Descriptions,
  Timeline,
  Tour,
} from 'antd';

// 反馈组件
export {
  Alert,
  Drawer,
  Modal,
  message,
  notification,
  Popconfirm,
  Result,
  Skeleton,
  Spin,
} from 'antd';

// 其他组件
export {
  Anchor,
  BackTop,
  ConfigProvider,
  Divider,
  Space,
  Typography,
  Affix,
  Grid,
  Watermark,
  QRCode,
  Segmented,
  FloatButton,
} from 'antd';

// 图标
export * from '@ant-design/icons';

// 类型定义
export type {
  FormInstance,
  TableProps,
  ButtonProps,
  InputProps,
  SelectProps,
  MenuProps,
  LayoutProps,
  CardProps,
  ModalProps,
  DrawerProps,
  UploadProps,
  DatePickerProps,
  TimePickerProps,
  TreeProps,
  TableColumnsType,
  FormProps,
  SpaceProps,
  TypographyProps,
} from 'antd';