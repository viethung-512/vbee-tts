import { useTranslation } from 'react-i18next';

function useLocalization() {
  const { t } = useTranslation();

  const materialTable = {
    toolbar: {
      searchTooltip: t('ACTIONS_SEARCH'),
      PLACEHOLDER_SEARCH: t('PLACEHOLDER_SEARCH'),
    },
    header: {
      actions: t('ACTIONS'),
    },
    body: {
      emptyDataSourceMessage: t('MESSAGE_EMPTY_DATA_SOURCE'),
    },
  };

  return { materialTable };
}

export default useLocalization;
