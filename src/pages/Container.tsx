import React, { useState } from 'react';
import * as antd from 'antd';
import { AppContext, Image } from '../AppContext';
import { ColumnsType } from 'antd/lib/table';
// import { ImageItem, CommandContext } from '../CommandContext';
import { DangerButton } from '../components/DangerButton';
import { Notification } from '../components/Notification';
import { PrimaryButton } from '../components/PrimaryButton';

import { ShowLog } from '../modals/ShowLog';
import { Inspect } from '../modals/Inspect';
import { CommitCon } from '../modals/CommitCon';
const { Option } = antd.Select;
const { Text } = antd.Typography;
interface Container {
  id: string;
  image: string;
  status: string;
  ports: string[];
  name: string;
}

const Container = () => {
  const appCtx = React.useContext(AppContext);

  const [data, setData] = useState<Container[]>([]);

  const initialize = async () => {
    let data = await appCtx.fetch('get', '/api/container/listall', '');
    if (data) {
      if (data.errorCode === 0) {
        let cons: Container[] = [];
        data.Containers.map((item: any) => {
          let portdata: string[] = [];

          if (item.ports !== '') {
            item.ports.split(',').map((ports: string) => {
              let ports2 = ports.split('-\u003e');
              if (ports2.length === 2) {
                portdata.push(
                  `${ports2[0].replace('0.0.0.0:', '')}:${ports2[1].replace('/tcp', '')}`,
                );
              }
            });
          }
          cons.push({
            id: item.id,
            image: item.image,
            ports: portdata,
            name: item.name,
            status: item.status,
          });
        });
        setData(cons);
      }
    }
  };

  React.useEffect(() => {
    initialize();
  }, []);

  const columns: ColumnsType<Container> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'Ports',
      dataIndex: 'ports',
      align: 'center',
      render: (_: string[], record: Container): JSX.Element => {
        return (
          <>
            {_.map((item) => {
              return (
                <>
                  <Text>{`${item}`}</Text>
                  <br />
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <PrimaryButton
          title="Commit"
          htmlType="button"
          onClick={() => appCtx.setModal(<CommitCon id={record.id} image={record.image} />)}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <PrimaryButton
          title="Inspect"
          htmlType="button"
          onClick={() => appCtx.setModal(<Inspect id={record.id} />, 1200)}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <PrimaryButton
          title="Log"
          htmlType="button"
          onClick={() => appCtx.setModal(<ShowLog id={record.id} />, 1200)}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <DangerButton
          title="Restart"
          message={`確定要Restart嗎？`}
          onClick={async () => {
            const data = await appCtx.fetch('put', `/api/container/${record.id}/restart`, '');

            if (data) {
              Notification.add('success', '成功Restart', '');
              initialize();
            }
          }}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <DangerButton
          title="Stop"
          message={`確定要Stop嗎？`}
          onClick={async () => {
            const data = await appCtx.fetch('put', `/api/container/${record.id}/stop`, '');

            if (data) {
              Notification.add('success', '成功Stop', '');
              initialize();
            }
          }}
        />
      ),
    },
    {
      title: '',
      dataIndex: '',
      align: 'center',
      render: (_: object, record: Container): JSX.Element => (
        <DangerButton
          title="Delete"
          message={`確定要Delete嗎？`}
          onClick={async () => {
            const data = await appCtx.fetch('delete', `/api/container/${record.id}`, '');

            if (data) {
              if (data.ErrStr !== '') {
                Notification.add('error', 'Delete失敗', data.ErrStr);
              } else {
                Notification.add('success', 'Delete成功', '');
                initialize();
              }
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="m-3" />
      <antd.Table<Container> bordered dataSource={data} columns={columns} pagination={false} />
    </>
  );
};

export { Container };
