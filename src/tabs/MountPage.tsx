import React, { useState } from 'react';
import * as antd from 'antd';
// import { AppContext } from '../AppContext';
import { ColumnsType } from 'antd/lib/table';
import { Iportmap, MountItem, PortItem, CommandContext } from '../CommandContext';

const { Title } = antd.Typography;

const MountPage = () => {
  const cmdCtx = React.useContext(CommandContext);
  React.useEffect(() => {}, []);

  ////// mount

  const [mountLocal, setMountLocal] = useState<string>('');
  const [mountContainer, setMountContainer] = useState<string>('');
  const [editingKey, setEditingKey] = useState<number>(-1);
  const isEditing = (record: MountItem) => record.key === editingKey;

  const editMount = (record: Partial<MountItem> & { key: React.Key }) => {
    console.log(record);
    setEditingKey(record.key);
    let newData: MountItem[] = cmdCtx.mountData.map((col) => {
      if (col.key === record.key) {
        return { ...col, isEditing: true };
      }
      return { ...col };
    });
    cmdCtx.setMountData(newData);
  };

  const cancelMount = (record: MountItem) => {
    setEditingKey(-1);
    let newData: MountItem[] = cmdCtx.mountData.map((col) => {
      if (col.key === record.key) {
        console.log(col);
        return { ...col, isEditing: false };
      }
      return { ...col };
    });
    cmdCtx.setMountData(newData);
  };

  const saveMount = async (key: React.Key) => {
    try {
      let newData: MountItem[] = cmdCtx.mountData.map((col) => {
        if (col.key === key) {
          return {
            ...col,
            isEditing: false,
            local: mountLocal,
            remote: mountContainer,
          };
        }
        return { ...col };
      });

      cmdCtx.setMountData(newData);
      setEditingKey(-1);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteMount = (record: MountItem) => {
    let newData: MountItem[] = cmdCtx.mountData.filter((col) => col.key !== record.key);
    cmdCtx.setMountData(newData);
  };

  const newMount = () => {
    cmdCtx.setMountData((state: MountItem[]) => {
      let key = 0;
      if (state.length !== 0) {
        key = state[state.length - 1].key + 1;
      }

      setEditingKey(key);
      return [
        ...state,
        {
          key: key,
          local: '',
          remote: '',
          isEditing: true,
        },
      ];
    });
  };

  const mountColumns: ColumnsType<MountItem> = [
    {
      title: 'Host Volume',
      dataIndex: 'local',
      align: 'center',
      width: '35%',
      render: (_: string, record: MountItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.local}
              onChange={(e) => {
                setMountLocal(e.target.value);
              }}
            />
          );
        } else {
          return record.local;
        }
      },
    },
    {
      title: 'Container Volume',
      dataIndex: 'value',
      align: 'center',
      width: '35%',
      render: (_: string, record: MountItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.remote}
              onChange={(e) => {
                setMountContainer(e.target.value);
              }}
            />
          );
        } else {
          return record.remote;
        }
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: object, record: MountItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="javascript:;" onClick={() => saveMount(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={() => cancelMount(record)}>Cancel</a>
          </span>
        ) : (
          <div className="d-flex justify-content-center">
            <antd.Typography.Link disabled={editingKey !== -1} onClick={() => editMount(record)}>
              Edit
            </antd.Typography.Link>
            <div className="m-2" />
            <antd.Typography.Link disabled={editingKey !== -1} onClick={() => deleteMount(record)}>
              Delete
            </antd.Typography.Link>
          </div>
        );
      },
    },
  ];

  ////// port

  const [portLocal, setPortLocal] = useState<string>('');
  const [portContainer, setPortContainer] = useState<string>('');
  const [portEditingKey, setPortEditingKey] = useState<number>(-1);
  const portIsEditing = (record: PortItem) => record.key === portEditingKey;

  const newPort = () => {
    cmdCtx.setPortData((state: PortItem[]) => {
      let key = 0;
      if (state.length !== 0) {
        key = state[state.length - 1].key + 1;
      }
      setPortEditingKey(key);
      return [
        ...state,
        {
          key: key,
          local: '',
          remote: '',
          isEditing: true,
        },
      ];
    });
  };

  const editPort = (record: Partial<PortItem> & { key: React.Key }) => {
    console.log(record);
    setPortEditingKey(record.key);
    let newData: PortItem[] = cmdCtx.portData.map((col) => {
      if (col.key === record.key) {
        return { ...col, isEditing: true };
      }
      return { ...col };
    });
    cmdCtx.setPortData(newData);
  };

  const cancelPort = (record: PortItem) => {
    setPortEditingKey(-1);
    let newData: PortItem[] = cmdCtx.portData.map((col) => {
      if (col.key === record.key) {
        return { ...col, isEditing: false };
      }
      return { ...col };
    });
    cmdCtx.setPortData(newData);
  };

  const savePort = async (key: React.Key) => {
    try {
      let newData: PortItem[] = cmdCtx.portData.map((col) => {
        if (col.key === key) {
          return {
            ...col,
            isEditing: false,
            local: portLocal,
            remote: portContainer,
          };
        }
        return { ...col };
      });

      cmdCtx.setPortData(newData);
      setPortEditingKey(-1);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deletePort = (record: PortItem) => {
    let newData: PortItem[] = cmdCtx.portData.filter((col) => col.key !== record.key);
    cmdCtx.setPortData(newData);
  };

  const portColumns: ColumnsType<PortItem> = [
    {
      title: 'Host Port',
      dataIndex: 'local',
      align: 'center',
      width: '35%',
      render: (_: string, record: PortItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.local}
              onChange={(e) => {
                setPortLocal(e.target.value);
              }}
            />
          );
        } else {
          return record.local;
        }
      },
    },
    {
      title: 'Container Port',
      dataIndex: 'value',
      align: 'center',
      width: '35%',
      render: (_: string, record: PortItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.remote}
              onChange={(e) => {
                setPortContainer(e.target.value);
              }}
            />
          );
        } else {
          return record.remote;
        }
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: object, record: PortItem) => {
        const editable = portIsEditing(record);
        return editable ? (
          <span>
            <a href="javascript:;" onClick={() => savePort(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={() => cancelPort(record)}>Cancel</a>
          </span>
        ) : (
          <div className="d-flex justify-content-center">
            <antd.Typography.Link disabled={portEditingKey !== -1} onClick={() => editPort(record)}>
              Edit
            </antd.Typography.Link>
            <div className="m-2" />
            <antd.Typography.Link
              disabled={portEditingKey !== -1}
              onClick={() => deletePort(record)}
            >
              Delete
            </antd.Typography.Link>
          </div>
        );
      },
    },
  ];

  const portMapCol: ColumnsType<Iportmap> = [
    {
      title: 'HostPort',
      dataIndex: 'hostPort',
      align: 'center',
      width: '35%',
    },
    {
      title: 'ContainerName',
      dataIndex: 'name',
      align: 'center',
      width: '35%',
    },
    {
      title: 'ContainerPort',
      dataIndex: 'containerPort',
      align: 'center',
    },
  ];

  /////////////////////////

  return (
    <>
      <div className="d-flex mb-2">
        <Title level={5}>Mount</Title>
        <div className="flex-fill" />
        <antd.Button onClick={newMount} disabled={editingKey !== -1}>
          New
        </antd.Button>
      </div>

      <antd.Table<MountItem>
        bordered
        dataSource={cmdCtx.mountData}
        columns={mountColumns}
        pagination={false}
      />

      <div className="d-flex my-2">
        <Title level={5}>Port Mapping</Title>
        <div className="flex-fill" />
        <antd.Button onClick={newPort} disabled={portEditingKey !== -1}>
          New
        </antd.Button>
      </div>
      <antd.Table<PortItem>
        bordered
        dataSource={cmdCtx.portData}
        columns={portColumns}
        pagination={false}
      />
      <div className="my-2">
        <Title level={5}>Ports in Use</Title>
      </div>
      <antd.Table<Iportmap>
        bordered
        dataSource={cmdCtx.portMap}
        columns={portMapCol}
        pagination={false}
      />
    </>
  );
};

export { MountPage };
