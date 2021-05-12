import React, { useState } from 'react';

interface CommandContextProps {
  imageData: ImageItem[];
  setImageData: (value: React.SetStateAction<ImageItem[]>) => void;
  mountData: MountItem[];
  setMountData: (value: React.SetStateAction<MountItem[]>) => void;
  portData: PortItem[];
  setPortData: (value: React.SetStateAction<PortItem[]>) => void;
  envData: EnvItem[];
  setEnvData: (value: React.SetStateAction<EnvItem[]>) => void;
  portMap: Iportmap[];
  setPortMap: (value: React.SetStateAction<Iportmap[]>) => void;
}

const CommandContext = React.createContext<CommandContextProps>(undefined!);

interface CommandProviderProps {
  children: React.ReactNode;
}

export interface ImageItem {
  key: string;
  value: string;
  note: string;
  isEditing: boolean;
}

const originCommand: ImageItem[] = [
  {
    key: 'image',
    value: 'node:latest',
    note: 'image名稱',
    isEditing: false,
  },
  {
    key: 'name',
    value: 'node_latest',
    note: 'container名稱',
    isEditing: false,
  },
  {
    key: 'restart',
    value: 'no',
    note: '是否自動Restart',
    isEditing: false,
  },
  {
    key: 'network',
    value: 'becreator',
    note: '網路環境',
    isEditing: false,
  },
  {
    key: 'network-alias',
    value: 'app',
    note: '網路別名',
    isEditing: false,
  },
  {
    key: 'workdir',
    value: '/becreator',
    note: '工作目錄',
    isEditing: false,
  },
  {
    key: 'cmd',
    value: 'node -v',
    note: 'CMD參數',
    isEditing: false,
  },
];

export interface MountItem {
  key: number;
  local: string;
  remote: string;
  isEditing: boolean;
}

export interface PortItem {
  key: number;
  local: string;
  remote: string;
  isEditing: boolean;
}

export interface EnvItem {
  key: number;
  envKey: string;
  envValue: string;
  note: string;
  isEditing: boolean;
}

export interface Iportmap {
  hostPort: string;
  containerPort: string;
  name: string;
}

const CommandProvider = ({ children }: CommandProviderProps) => {
  const [imageData, setImageData] = useState<ImageItem[]>(originCommand);
  const [mountData, setMountData] = useState<MountItem[]>([]);
  const [portData, setPortData] = useState<MountItem[]>([]);
  const [envData, setEnvData] = useState<EnvItem[]>([]);
  const [portMap, setPortMap] = useState<Iportmap[]>([]);

  const initialize = async () => {};

  React.useEffect(() => {
    initialize();
  }, []);

  /////////////////////////////////////////////////////

  return (
    <CommandContext.Provider
      value={{
        imageData,
        setImageData,
        mountData,
        setMountData,
        portData,
        setPortData,
        envData,
        setEnvData,
        portMap,
        setPortMap,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export { CommandContext, CommandProvider };
