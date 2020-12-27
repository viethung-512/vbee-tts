import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorOption, FieldName } from 'react-hook-form';
import { FieldError } from '@tts-dev/common';
import useAlert from 'hooks/useAlert';

function useMutation<Fields, Res>(
  mutate: (...args: any) => Promise<Res>,
  setError: (name: FieldName<Fields>, error: ErrorOption) => void,
  callback?: (...args: any) => void
) {
  const { t }: { t: any } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Res>();
  const [variables, setVariables] = useState<{
    active: boolean;
    data: any;
  }>({
    active: false,
    data: null,
  });
  const { alertSuccess, alertError } = useAlert();

  useEffect(() => {
    const doAsyncRequest = async (...args: any) => {
      setLoading(true);

      try {
        const response: Res = await mutate(...args);

        setLoading(false);
        setResult(response);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        if (callback) {
          callback();
        }
      } catch (err) {
        console.log(err);

        (err as FieldError[]).forEach(e => {
          if (e.field) {
            const field = e.field as FieldName<Fields>;
            const message = e.message;

            setError(field, { message });
          } else {
            alertError(e.message);
          }
        });

        setLoading(false);
      }
    };

    if (variables.active) {
      doAsyncRequest(...variables.data);
    }

    return () => {
      setVariables({
        active: false,
        data: null,
      });
    };

    // eslint-disable-next-line
  }, [variables.active]);

  const doRequest = async (...args: any) => {
    setVariables({
      active: true,
      data: args,
    });
  };

  return {
    loading,
    result,
    doRequest,
  };
}

export default useMutation;
