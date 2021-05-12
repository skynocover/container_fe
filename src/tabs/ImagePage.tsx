import React, { useState } from 'react';
import * as antd from 'antd';
import { AppContext, Image } from '../AppContext';
import { ColumnsType } from 'antd/lib/table';
import { ImageItem, CommandContext } from '../CommandContext';
const { Option } = antd.Select;

const ImagePage = () => {
  const cmdCtx = React.useContext(CommandContext);
  const appCtx = React.useContext(AppContext);
  const [editName, setEditName] = useState<string>('');
  const [images, setImages] = useState<Image[]>([]);
  const [nets, setNets] = useState<network[]>([]);

  const init = async () => {
    let data = await appCtx.fetch('get', '/api/image', '');
    if (data) {
      setImages(data.Images);
    }

    data = await appCtx.fetch('get', '/api/setting/network');
    if (data) {
      setNets(data.Networks);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  interface network {
    id: string;
    name: string;
    driver: string;
    scope: string;
  }

  const [editingKey, setEditingKey] = useState<string>('');
  const isEditing = (record: ImageItem) => record.key === editingKey;

  const edit = (record: Partial<ImageItem> & { key: React.Key }) => {
    setEditingKey(record.key);
    let newData: ImageItem[] = cmdCtx.imageData.map((col) => {
      if (col.key === record.key) {
        return { ...col, isEditing: true };
      }
      return { ...col };
    });
    cmdCtx.setImageData(newData);
  };

  const cancel = (record: ImageItem) => {
    setEditingKey('');
    let newData: ImageItem[] = cmdCtx.imageData.map((col) => {
      if (col.key === record.key) {
        console.log(col);
        return { ...col, isEditing: false };
      }
      return { ...col };
    });
    cmdCtx.setImageData(newData);
  };

  const save = async (key: React.Key) => {
    try {
      let newData: ImageItem[] = cmdCtx.imageData.map((col) => {
        if (col.key === key) {
          return { ...col, isEditing: false, value: editName };
        }
        return { ...col };
      });
      console.table(newData);
      cmdCtx.setImageData(newData);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns: ColumnsType<ImageItem> = [
    {
      title: 'Key',
      dataIndex: 'key',
      align: 'center',
      width: '25%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      width: '25%',
      render: (_: string, record: ImageItem) => {
        if (record.isEditing && record.key === 'restart') {
          return (
            <antd.Select
              defaultValue="no"
              style={{ width: 120 }}
              onChange={(value) => {
                setEditName(value);
              }}
            >
              <Option value="no">no</Option>
              <Option value="always">always</Option>
              <Option value="on-failure">on-failure</Option>
              <Option value="unless-stopped">unless-stopped</Option>
            </antd.Select>
          );
        } else if (record.isEditing && record.key === 'image') {
          return (
            <antd.Select
              defaultValue=""
              style={{ width: 200 }}
              onChange={(value) => {
                setEditName(value);
              }}
            >
              {images.map((image) => {
                let images = image.repository.split('/');
                let imagename = images[images.length - 1];

                return (
                  <Option
                    value={`${image.repository}:${image.tag}`}
                  >{`${imagename}:${image.tag}`}</Option>
                );
              })}
            </antd.Select>
          );
        } else if (record.isEditing && record.key === 'network') {
          return (
            <antd.Select
              defaultValue=""
              style={{ width: 200 }}
              onChange={(value) => {
                setEditName(value);
              }}
            >
              {nets.map((net) => (
                <Option value={`${net.name}`}>{`${net.name}`}</Option>
              ))}
            </antd.Select>
          );
        } else if (record.isEditing) {
          return (
            <antd.Input
              defaultValue={record.value}
              onChange={(e) => {
                setEditName(e.target.value);
              }}
            />
          );
        } else {
          return record.value;
        }
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      align: 'center',
      width: '40%',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: object, record: ImageItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="javascript:;" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <a onClick={() => cancel(record)}>Cancel</a>
          </span>
        ) : (
          <antd.Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </antd.Typography.Link>
        );
      },
    },
  ];

  return (
    <antd.Table<ImageItem>
      bordered
      dataSource={cmdCtx.imageData}
      columns={columns}
      pagination={false}
    />
  );
};

export { ImagePage };
