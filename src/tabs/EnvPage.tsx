import React, { useState } from 'react';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EnvItem, CommandContext } from '../CommandContext';

const { Title } = antd.Typography;

const EnvPage = () => {
  const cmdCtx = React.useContext(CommandContext);
  React.useEffect(() => {}, []);

  ////// mount

  const [envKey, setEnvKey] = useState<string>('');
  const [envValue, setEnvValue] = useState<string>('');
  const [envNote, setEnvNote] = useState<string>('');
  const [editingKey, setEditingKey] = useState<number>(-1);
  const isEditing = (record: EnvItem) => record.key === editingKey;

  const editMount = (record: Partial<EnvItem> & { key: React.Key }) => {
    console.log(record);
    setEditingKey(record.key);
    let newData: EnvItem[] = cmdCtx.envData.map((col) => {
      if (col.key === record.key) {
        return { ...col, isEditing: true };
      }
      return { ...col };
    });
    cmdCtx.setEnvData(newData);
  };

  const cancelMount = (record: EnvItem) => {
    setEditingKey(-1);
    let newData: EnvItem[] = cmdCtx.envData.map((col) => {
      if (col.key === record.key) {
        console.log(col);
        return { ...col, isEditing: false };
      }
      return { ...col };
    });
    cmdCtx.setEnvData(newData);
  };

  const saveMount = async (key: React.Key) => {
    try {
      let newData: EnvItem[] = cmdCtx.envData.map((col) => {
        if (col.key === key) {
          return {
            ...col,
            isEditing: false,
            envKey: envKey,
            envValue: envValue,
            note: envNote,
          };
        }
        return { ...col };
      });

      cmdCtx.setEnvData(newData);
      setEditingKey(-1);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteMount = (record: EnvItem) => {
    let newData: EnvItem[] = cmdCtx.envData.filter((col) => col.key !== record.key);
    cmdCtx.setEnvData(newData);
  };

  const newEnv = () => {
    cmdCtx.setEnvData((state: EnvItem[]) => {
      let key = 0;
      if (state.length !== 0) {
        key = state[state.length - 1].key + 1;
      }
      setEditingKey(key);

      return [
        ...state,
        {
          key: key,
          envKey: '',
          envValue: '',
          note: '',
          isEditing: true,
        },
      ];
    });
  };

  const mountColumns: ColumnsType<EnvItem> = [
    {
      title: 'Key',
      dataIndex: 'key',
      align: 'center',
      width: '30%',
      render: (_: string, record: EnvItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.envKey}
              onChange={(e) => {
                setEnvKey(e.target.value);
              }}
            />
          );
        } else {
          return record.envKey;
        }
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      width: '30%',
      render: (_: string, record: EnvItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.envValue}
              onChange={(e) => {
                setEnvValue(e.target.value);
              }}
            />
          );
        } else {
          return record.envValue;
        }
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      align: 'center',
      width: '20%',
      render: (_: string, record: EnvItem) => {
        if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.note}
              onChange={(e) => {
                setEnvNote(e.target.value);
              }}
            />
          );
        } else {
          return record.note;
        }
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: object, record: EnvItem) => {
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

  /////////////////////////

  return (
    <>
      <div className="d-flex mb-2">
        <Title level={5}>Mount</Title>
        <div className="flex-fill" />
        <antd.Button onClick={newEnv} disabled={editingKey !== -1}>
          New
        </antd.Button>
      </div>

      <antd.Table<EnvItem>
        bordered
        dataSource={cmdCtx.envData}
        columns={mountColumns}
        pagination={false}
      />
    </>
  );
};

export { EnvPage };
