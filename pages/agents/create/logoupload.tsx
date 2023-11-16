import React from 'react';
import { Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
type LogoUploadProps = {
    value?: string;
    onChange?: (filePath: string) => void;
  };
  const LogoUpload = ({ value = '', onChange }: LogoUploadProps) => {
    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
    
        const response = await axios.post('https://api.play888king.com/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    
        const filePath = typeof response.data.filePath === 'string' ? response.data.filePath : '';
        if (onChange) {
            onChange(filePath);
        }
        return filePath;
    };

    return (
        <>
            <Upload
                listType="picture"
                beforeUpload={async (file) => {
                    const filePath = await handleFileUpload(file);
                }}
                accept=".png,.jpg,.jpeg"
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Input value={value} readOnly />
        </>
    );
};

export default LogoUpload;