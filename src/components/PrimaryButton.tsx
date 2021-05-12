import React from 'react';
import * as antd from 'antd';

interface button {
  title: string;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  htmlType: 'button' | 'submit' | 'reset' | undefined;
}

const PrimaryButton = (props: button) => {
  return (
    <antd.Button type="primary" onClick={props.onClick} htmlType={props.htmlType}>
      {/* <antd.Button type="primary" shape="round" onClick={props.onClick} htmlType={props.htmlType}> */}
      {props.title}
    </antd.Button>
  );
};

export { PrimaryButton };
