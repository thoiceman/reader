import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('感谢您的留言！我们会尽快回复您。');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact">
      <div className="container">
        <div className="contact-content">
          <h1 className="contact-title">联系我们</h1>
          <p className="contact-subtitle">
            有任何问题或建议？请随时与我们联系。
          </p>
          
          <div className="contact-wrapper">
            <div className="contact-info">
              <h3>联系信息</h3>
              <div className="info-item">
                <strong>邮箱：</strong>
                <span>contact@example.com</span>
              </div>
              <div className="info-item">
                <strong>电话：</strong>
                <span>+86 123 4567 8900</span>
              </div>
              <div className="info-item">
                <strong>地址：</strong>
                <span>北京市朝阳区示例街道123号</span>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">姓名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">邮箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">留言</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                发送留言
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;