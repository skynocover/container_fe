import React from 'react';
import * as antd from 'antd';

import { AppContext } from '../AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Notification } from '../components/Notification';

const { Title } = antd.Typography;

interface addImage {
  onSuccess: () => any;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddImage = (props: addImage) => {
  const appCtx = React.useContext(AppContext);

  /////////////////////////////////////////////////////

  const onFinish = async (values: any) => {
    props.setPending(true);
    appCtx.setModal(null);

    const data = await appCtx.fetch('post', '/api/image', {
      registry: values.registry,
      image: `${values.image}:${values.tag}`,
    });

    if (data) {
      if (data.errorCode === 0) {
        Notification.add('success', 'Pull image 成功', '');
      } else {
        Notification.add('error', 'Pull 失敗', data.ErrStr);
      }

      props.setPending(false);
      props.onSuccess();
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 },
    },
  };

  /////////////////////////////////////////////////////

  return (
    <antd.Form
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{ tag: 'latest', registry: '192.168.23.20' }}
    >
      <Title level={3}>NewImage</Title>
      <div className="mb-4" />
      <antd.Form.Item
        name="image"
        label="image名稱"
        rules={[{ required: true, message: 'image名稱不可以空白!' }]}
      >
        <antd.Input prefix={<i className="fa fa-tags" />} placeholder="node" />
      </antd.Form.Item>

      <antd.Form.Item name="tag" label="image tag">
        <antd.Input prefix={<i className="fa fa-tags" />} placeholder="latest" />
      </antd.Form.Item>

      <antd.Form.Item name="registry" label="倉庫位置">
        <antd.Input prefix={<i className="fa fa-server" />} />
      </antd.Form.Item>

      <antd.Form.Item className="text-center">
        <PrimaryButton title="Pull" htmlType="submit" onClick={() => {}} />
      </antd.Form.Item>
    </antd.Form>
  );
};

export { AddImage };
