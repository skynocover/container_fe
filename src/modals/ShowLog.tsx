import React from 'react';
import * as antd from 'antd';
import dayjs from 'dayjs';

// import ReactMarkdown from 'react-markdown';

import { AppContext } from '../AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { Notification } from '../components/Notification';

const { RangePicker } = antd.DatePicker;
const { Title, Paragraph } = antd.Typography;

interface logs {
  id: string;
}

const ShowLog = (props: logs) => {
  const appCtx = React.useContext(AppContext);

  const [since, setSince] = React.useState<string | null>(null);
  const [until, setUntil] = React.useState<string | null>(null);
  const [logNum, setLogNum] = React.useState<number>(10);

  const [outlog, setOutlog] = React.useState<string[]>([]);
  const [errlog, setErrlog] = React.useState<string[]>([]);

  /////////////////////////////////////////////////////

  React.useEffect(() => {
    const initialize = () => {
      setOutlog([]);
      setErrlog([]);
    };

    initialize();
  }, []);

  const search = async () => {
    let urldata = {};

    const searchParams = new URLSearchParams(urldata);
    if (since) {
      searchParams.append('since', since);
    }

    if (until) {
      searchParams.append('until', until);
    }

    if (logNum !== 0) {
      searchParams.append('tail', String(logNum));
    }

    const data = await appCtx.fetch('get', `/api/container/logs/${props.id}?${searchParams}`);
    if (data) {
      if (data.errorCode === 0) {
        setOutlog(data.OutStr.split('\n'));
        setErrlog(data.ErrStr.split('\n'));
      }
    }
  };

  const sinceOnOk = (date: any) => {
    setSince(dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ'));
  };
  const untilOnOk = (date: any) => {
    setUntil(dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ'));
  };

  const numberChange = (value: string | number | undefined) => {
    if (typeof value !== 'undefined') {
      if (typeof value === 'number') {
        setLogNum(value);
      } else {
        var y: number = +value;
        setLogNum(y);
      }
    }
  };

  /////////////////////////////////////////////////////

  return (
    <div style={{ maxHeight: 700, minHeight: 500 }}>
      <h5 className="font-weight-bold mb-4">Show Logs</h5>
      <div className="d-flex align-items-center mb-2">
        <h6 className="font-weight-normal m-0 mx-3">起始時間</h6>
        <antd.DatePicker showTime onOk={sinceOnOk} placeholder={'起始時間'} />
        <h6 className="font-weight-normal m-0 mx-3">結束時間</h6>
        <antd.DatePicker showTime onOk={untilOnOk} />
        <h6 className="font-weight-normal m-0 mx-3">選擇查詢行數(0表示不限制)</h6>
        <antd.InputNumber min={0} defaultValue={logNum} onChange={numberChange} />
        <PrimaryButton title="查詢" htmlType="button" onClick={() => search()} />
        {/* <ReactMarkdown>{log}</ReactMarkdown> */}
      </div>
      <h5 className="h6 mb-4">OutLog</h5>
      {outlog.map((item: string) => (
        <Paragraph ellipsis>{item}</Paragraph>
      ))}
      <h5 className="h6 mb-4">ErrLog</h5>
      {errlog.map((item: string) => (
        <Paragraph ellipsis>{item}</Paragraph>
      ))}
      {/* <Paragraph ellipsis>{log}</Paragraph> */}
    </div>
  );
};

export { ShowLog };
