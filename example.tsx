import React, { FC, useCallback } from 'react';

import { useScriptLoader } from '@/hooks';

const AlipayOAuth: FC = () => {
  const [ap, { error, retry }] = useScriptLoader('https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js', 'ap');

  const log = useCallback(() => {
    console.log(ap);
    console.log((window as any).ap);
  }, [ap]);

  return (
    <div>
      <h1>
        AlipayOAuth
      </h1>
      <div onClick={log} >
        Log
      </div>
      {error !== ''
        ? <div onClick={retry}>
          <p> 出错啦, [{error}] </p>
          <p> 点我重试 </p>
        </div>
        : null
      }
    </div>
  );
};

export default AlipayOAuth;
