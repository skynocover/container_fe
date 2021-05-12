import React from 'react';
import axios from 'axios';
import * as antd from 'antd';

axios.defaults.baseURL = '/';
axios.defaults.headers.common['Content-Type'] = 'application/json';
//axios.defaults.timeout = 5000;

interface AppContextProps {
  fetch: (method: 'get' | 'post' | 'delete' | 'put', url: string, param?: any) => Promise<any>;
  setModal: (modal: React.ReactNode | null, width?: number) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}
export interface Image {
  repository: string;
  tag: string;
  id: string;
  created: string;
  size: string;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<React.ReactNode | null>(null);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [modalWidth, setModalWidth] = React.useState<number>(520);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const initialize = async () => {};

  React.useEffect(() => {
    initialize();
  }, []);

  /////////////////////////////////////////////////////

  const fetch = async (method: 'get' | 'post' | 'delete' | 'put', url: string, param?: any) => {
    // Send a POST request
    try {
      const response = await axios({
        method,
        url,
        data: param,
      });

      if (response) {
        return response.data;
      } else {
        throw new Error('Response fail');
      }
    } catch (e) {
      window.alert(e);
      return null;
    }
  };

  /////////////////////////////////////////////////////

  React.useEffect(() => {}, []);

  return (
    <AppContext.Provider
      value={{
        fetch,

        setModal: (modal: React.ReactNode | null, width: number = 520) => {
          setModalWidth(width);
          setModal(modal);
        },
        collapsed,
        onCollapse,
      }}
    >
      {modal && (
        <antd.Modal
          visible={modal !== null}
          onOk={() => setModal(null)}
          onCancel={() => {
            setModal(null);
          }}
          width={modalWidth}
          footer={null}
          closable={false}
        >
          {modal}
        </antd.Modal>
      )}

      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
