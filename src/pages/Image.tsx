import React, { useState } from 'react';
import * as antd from 'antd';
import { AppContext, Image } from '../AppContext';
import { ColumnsType } from 'antd/lib/table';
// import { ImageItem, CommandContext } from '../CommandContext';
import { DangerButton } from '../components/DangerButton';
import { Notification } from '../components/Notification';
import { PrimaryButton } from '../components/PrimaryButton';
import { AddImage } from '../modals/AddImage';
const { Option } = antd.Select;

const Images = () => {
  const appCtx = React.useContext(AppContext);

  const [data, setData] = useState<Image[]>([]);
  const [pending, setPending] = useState<boolean>(false);

  const initialize = async () => {
    let data = await appCtx.fetch('get', '/api/image', '');
    if (data) {
      setData(data.Images);
    }
  };

  React.useEffect(() => {
    initialize();
  }, []);

  const columns: ColumnsType<Image> = [
    {
      title: 'Repository',
      dataIndex: 'repository',
      align: 'center',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      align: 'center',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      align: 'center',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      align: 'center',
    },
    {
      title: 'Delete',
      dataIndex: 'operation',
      align: 'center',
      render: (_: object, record: Image): JSX.Element => (
        <DangerButton
          title="Delete"
          message={`你確定要Delete嗎？`}
          onClick={async () => {
            const data = await appCtx.fetch('delete', `/api/image/${record.id}`, {});

            if (data) {
              if (data.errorCode === 0) {
                Notification.add('success', 'Delete成功', '');
                initialize();
              } else {
                Notification.add('error', 'Delete失敗', data.ErrStr);
              }
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <PrimaryButton
        title="Pull"
        onClick={() => appCtx.setModal(<AddImage onSuccess={initialize} setPending={setPending} />)}
        htmlType="button"
      />

      <div className="m-3" />
      <antd.Spin spinning={pending}>
        <antd.Table<Image> bordered dataSource={data} columns={columns} pagination={false} />
      </antd.Spin>
    </>
  );
};

export { Images };
