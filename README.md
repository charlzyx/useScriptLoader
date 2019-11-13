# useScriptLoader
hooks to use &lt;script /> like a loader.

## source
```ts
import { useCallback, useEffect, useState } from 'react';

const useScriptLoader = <T extends object = any>(url: string, libName: string, init?: T) => {

  const [x, setX] = useState<T>(init as any);
  const [error, setError] = useState<string>('');

  const reload = useCallback(() => {
    const script = document.createElement('script');
    setError('');

    script.src = url;
    script.async = true;

    script.onload = () => {
      setX((window as any)[libName]);
      // 卸磨杀驴, 过河拆桥
      delete (window as any)[libName];
      document.body.removeChild(script);
    };

    script.onerror = () => {
      setError(`<script src="${url}" /> error.`);
      document.body.removeChild(script);
    };

    script.onabort = () => {
      setError(`<script src="${url}" /> was abort.`);
      document.body.removeChild(script);
    };

    document.body.appendChild(script);

    return () => {};
  }, [url]);

  useEffect(() => {
    return reload();
  }, [url]);

  const helper = {
    // !== '' 表示加载失败
    error,
    // 重试
    retry: reload,
  };
  const anwser: [typeof x, typeof helper] = [x, helper];
  return anwser;
};

export default useScriptLoader;

```

## example
```tsx
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
```
