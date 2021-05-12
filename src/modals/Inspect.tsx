import React, { useState } from 'react';
import * as antd from 'antd';
import dayjs from 'dayjs';
import ReactJson from 'react-json-view';
// import ReactMarkdown from 'react-markdown';

import { AppContext } from '../AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Notification } from '../components/Notification';

const { Title, Paragraph } = antd.Typography;

interface logs {
  id: string;
}

const Inspect = (props: logs) => {
  const appCtx = React.useContext(AppContext);

  const [inspect, setInspect] = useState<object>({});

  /////////////////////////////////////////////////////
  const initialize = async () => {
    const data = await appCtx.fetch('get', `/api/container/inspect/${props.id}`);
    if (data) {
      if (data.errorCode === 0) {
        // console.log(data.OutStr);

        setInspect(JSON.parse(data.OutStr));
      }
    }
  };
  React.useEffect(() => {
    initialize();
  }, []);

  /////////////////////////////////////////////////////

  return (
    <div style={{ maxHeight: 700, minHeight: 500, overflow: 'scroll' }}>
      <h5 className="font-weight-bold mb-4">Inspect</h5>
      <ReactJson src={inspect} enableClipboard={false} theme="mocha" />
    </div>
  );
};

export { Inspect };
