import React, { useState } from 'react';
import * as antd from 'antd';
import { AppContext } from '../AppContext';
import { CommandContext, CommandProvider } from '../CommandContext';
import { ColumnsType } from 'antd/lib/table';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Notification } from '../components/Notification';
import { ImagePage } from '../tabs/ImagePage';
import { MountPage } from '../tabs/MountPage';
import { EnvPage } from '../tabs/EnvPage';

const { Title } = antd.Typography;
const { TabPane } = antd.Tabs;

const Command = () => {
  const cmdCtx = React.useContext(CommandContext);
  const appCtx = React.useContext(AppContext);

  const [command, setCommand] = useState<string>('');

  const init = async () => {
    const data = await appCtx.fetch('get', '/api/setting/portmap');
    if (data) {
      if (data.errorCode === 0) {
        cmdCtx.setPortMap(data.PortMaps);
      } else {
        Notification.add('error', `取得PortMap失敗`, `${data.errorMessage}`);
      }
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    commandRender();
  }, [cmdCtx.imageData, cmdCtx.mountData, cmdCtx.portData, cmdCtx.envData]);

  const commandRender = () => {
    let obj = new Map<string, string | boolean>();

    cmdCtx.imageData.map((item) => {
      obj.set(item.key, item.value);
    });

    let mountMap = '';
    cmdCtx.mountData.map((item) => {
      if (item.local !== '' && item.remote !== '') {
        mountMap = `${mountMap} -v ${item.local}:${item.remote}`;
      }
    });

    let portMap = '';
    cmdCtx.portData.map((item) => {
      if (item.local !== '' && item.remote !== '') {
        portMap = `${portMap} -p ${item.local}:${item.remote}`;
      }
    });

    let envMap = '';
    cmdCtx.envData.map((item) => {
      if (item.envKey !== '' && item.envValue !== '') {
        envMap = `${envMap} -e ${item.envKey}=${item.envValue}`;
      }
    });

    let image = obj.get('image') as string;
    image = image.split(':')[0];

    let images = image.split('/');
    image = images[images.length - 1];

    setCommand(
      `docker run -d ` +
        (obj.get('name') ? `--name ${obj.get('name')} ` : '') +
        (mountMap ? `${mountMap} ` : '') +
        (portMap ? `${portMap} ` : '') +
        (envMap ? `${envMap} ` : '') +
        (obj.get('workdir') ? `-w ${obj.get('workdir')} ` : '') +
        (obj.get('network') ? `--network ${obj.get('network')} ` : '') +
        (obj.get('network-alias') ? `--network-alias ${obj.get('network-alias')} ` : '') +
        `--restart=${obj.get('restart')} ` +
        `${obj.get('image')} ${obj.get('cmd')}`,
    );
  };

  const exec = async () => {
    let arg: string[] = [];

    let commands = command.replace('docker run -d ', '').split(' ');
    commands.map((item) => {
      if (item != '') {
        arg.push(item);
      }
    });

    let data = await appCtx.fetch('post', '/api/docker/exec', {
      arg: arg,
    });

    if (data) {
      if (data.ErrStr !== '') {
        Notification.add('error', 'container產生失敗', data.ErrStr);
      } else {
        Notification.add('success', 'container產生成功', '');
      }
    }

    console.table(data);
  };

  interface Icommand {
    command: string;
  }

  const commandData: Icommand[] = [
    {
      command: command,
    },
  ];

  const commandCol: ColumnsType<Icommand> = [
    {
      title: 'Docker Command',
      dataIndex: 'command',
      align: 'center',
    },
    {
      title: '',
      dataIndex: 'action',
      align: 'center',
      width: '25%',
      render: () => {
        return (
          <div className="d-flex justify-content-center">
            <CopyToClipboard text={command}>
              <antd.Button
                onClick={() => {
                  Notification.add('success', `已複製 `, `${command}`);
                }}
              >
                Copy
              </antd.Button>
            </CopyToClipboard>
            <div className="mr-3" />
            <antd.Button
              onClick={() => {
                exec();
              }}
            >
              Exec
            </antd.Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <antd.Table<Icommand>
        bordered
        dataSource={commandData}
        columns={commandCol}
        pagination={false}
      />

      <div className="my-2" />

      <antd.Tabs type="card">
        <TabPane tab="Command Options" key="1">
          <ImagePage />
        </TabPane>
        <TabPane tab="Mapping Parameters" key="2">
          <MountPage />
        </TabPane>
        <TabPane tab="Enviroment Variables" key="3">
          <EnvPage />
        </TabPane>
      </antd.Tabs>
    </>
  );
};

const CommandWrapper = () => {
  return (
    <CommandProvider>
      <Command />
    </CommandProvider>
  );
};

export { CommandWrapper };
