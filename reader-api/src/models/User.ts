import mongoose, { Document, Schema } from 'mongoose';

// 用户接口定义
export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 用户Schema定义
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, '用户名是必需的'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少需要3个字符'],
    maxlength: [30, '用户名不能超过30个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱是必需的'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码是必需的'],
    minlength: [6, '密码至少需要6个字符']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, '名字不能超过50个字符']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, '姓氏不能超过50个字符']
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // 自动添加createdAt和updatedAt字段
  versionKey: false // 禁用__v字段
});

// 索引
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });

// 虚拟字段：全名
UserSchema.virtual('fullName').get(function(this: IUser) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

// 确保虚拟字段在JSON序列化时包含
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // 不返回密码字段
    return ret;
  }
});

// 导出模型
export const User = mongoose.model<IUser>('User', UserSchema);
export default User;