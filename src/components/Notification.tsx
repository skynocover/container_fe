import * as antd from 'antd';

let notificationDisabled = false;

const Notification = {
  add: (type: string, title: string, msg: string) => {
    if (notificationDisabled) {
      return;
    }

    notificationDisabled = true;

    if (type === 'success') {
      antd.notification.success({
        message: title,
        description: msg,
        duration: 1.5,
      });
    } else if (type === 'error') {
      antd.notification.error({
        message: title,
        description: msg,
        duration: 1.5,
      });
    }

    setTimeout(() => (notificationDisabled = false), 2000);
  },
};

export { Notification };
