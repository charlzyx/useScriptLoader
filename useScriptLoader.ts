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
