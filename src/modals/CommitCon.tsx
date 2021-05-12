import React, { useState } from 'react';
import * as antd from 'antd';

import { AppContext } from '../AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Notification } from '../components/Notification';
import { ColumnsType } from 'antd/lib/table';

const { Title } = antd.Typography;
const { Option } = antd.Select;

interface commit {
  id: string;
  image: string;
}

const CommitCon = (props: commit) => {
  const appCtx = React.useContext(AppContext);

  const [commitValue, setCommitValue] = useState<commitItem[]>([]);
  const [imageName, setImageName] = useState<string>('');
  const [pause, setPause] = useState<boolean>(true);

  /////////////////////////////////////////////////////

  const commit = async (values: any) => {
    appCtx.setModal(null);

    let change: string[] = [];
    commitValue.map((commit) => {
      change.push(`${commit.instructions} ${commit.value}`);
    });

    const data = await appCtx.fetch('post', '/api/container/commit', {
      id: props.id,
      image: imageName,
      pause: pause,
    });

    if (data) {
      if (data.errorCode === 0) {
        Notification.add('success', 'commit成功', '');
      } else {
        Notification.add('error', 'commit失敗', data.ErrStr);
      }
    }
  };

  const setInstruction = (key: number, value: string, type: 'key' | 'value') => {
    let newCommit: commitItem[] = commitValue.map((commit) => {
      if (commit.key === key) {
        switch (type) {
          case 'key':
            return {
              ...commit,
              instructions: value,
            };

          default:
            return {
              ...commit,
              value: value,
            };
        }
      }
      return { ...commit };
    });
    setCommitValue(newCommit);
  };

  const delCommit = (key: number) => {
    let newData: commitItem[] = commitValue.filter((commit) => commit.key !== key);
    setCommitValue(newData);
  };

  const newCommit = () => {
    setCommitValue((state: commitItem[]) => {
      let key = 0;
      if (state.length !== 0) {
        key = state[state.length - 1].key + 1;
      }
      return [
        ...state,
        {
          key: key,
          instructions: 'ADD',
          value: '',
        },
      ];
    });
  };

  interface commitItem {
    key: number;
    instructions: string;
    value: string;
  }

  const mountColumns: ColumnsType<commitItem> = [
    {
      title: 'instructions',
      dataIndex: 'instructions',
      align: 'center',
      width: '30%',
      render: (_: string, record: commitItem) => {
        return (
          <antd.Select
            defaultValue="ADD"
            style={{ width: 120 }}
            onChange={(value) => {
              setInstruction(record.key, value, 'key');
            }}
          >
            <Option value="ADD">ADD</Option>
            <Option value="COPY">COPY</Option>
            <Option value="ENV">ENV</Option>
            <Option value="EXPOSE">EXPOSE</Option>
            <Option value="FROM">FROM</Option>
            <Option value="LABEL">LABEL</Option>
            <Option value="STOPSIGNAL">STOPSIGNAL</Option>
            <Option value="USER">USER</Option>
            <Option value="VOLUME">VOLUME</Option>
            <Option value="WORKDIR">WORKDIR</Option>
            <Option value="ONBUILD ">ONBUILD </Option>
          </antd.Select>
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      width: '30%',
      render: (_: string, record: commitItem) => {
        return (
          <antd.Input
            defaultValue={record.value}
            onChange={(e) => {
              setInstruction(record.key, e.target.value, 'value');
            }}
          />
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      width: '30%',
      render: (_: string, record: commitItem) => {
        return (
          <antd.Button type="primary" danger onClick={() => delCommit(record.key)}>
            Delete
          </antd.Button>
        );
      },
    },
  ];

  /////////////////////////////////////////////////////

  return (
    <>
      <Title level={4}>Commit Container</Title>

      <div className="d-flex align-items-center my-2">
        <Title level={5} style={{ margin: 0, width: 180 }}>
          請輸入image
        </Title>
        <antd.Input placeholder="請輸入image" onChange={(e) => setImageName(e.target.value)} />
      </div>

      <div className="d-flex align-items-center my-2">
        <Title level={5} style={{ margin: 0, width: 180 }}>
          暫停container
        </Title>
        <antd.Switch defaultChecked onChange={setPause} />
      </div>

      <div className="d-flex m-0 my-2 align-items-center">
        <Title level={5} style={{ margin: 0 }}>
          Dockerfile Command
        </Title>
        <div className="flex-fill" />
        <antd.Button onClick={newCommit}>New</antd.Button>
      </div>

      <antd.Table<commitItem>
        bordered
        dataSource={commitValue}
        columns={mountColumns}
        pagination={false}
      />

      <div className="d-flex mt-2">
        <div className="flex-fill" />
        <PrimaryButton title="Commit" htmlType="submit" onClick={commit} />
      </div>
    </>
  );
};

export { CommitCon };
