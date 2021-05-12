import React from 'react';
import * as antd from 'antd';

interface button {
  title: string;
  message: string;
  onClick: (args?: any) => any;
}

const DangerButton = (props: button) => {
  return (
    <antd.Button
      type="primary"
      shape="round"
      onClick={() =>
        antd.Modal.confirm({
          title: '確認',
          icon: <i />,
          content: props.message,
          okText: '確認',
          cancelText: '取消',
          onOk: props.onClick,
        })
      }
      danger
    >
      {props.title}
    </antd.Button>
  );
};

export { DangerButton };
