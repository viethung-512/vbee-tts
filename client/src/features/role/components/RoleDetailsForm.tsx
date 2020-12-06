import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Select, {
  ValueType,
  // ActionMeta, OptionsType
} from 'react-select';

import { getResourceName, getActionName } from 'app/utils/helper';
import Input from 'app/layout/commons/form/Input';
import { Action, Resource } from '@tts-dev/common';
import { RoleResource } from 'app/types/role';

export interface RoleActionField {
  name: string;
  policy: string;
  // resources: RoleResource[];
}

interface ActionOptionType {
  label: string;
  value: Action;
}

interface Props {
  control: Control;
  errors: FieldErrors<RoleActionField>;
  resources: RoleResource[];
  resourcesValid: boolean;
  roleId?: string;
  setResources: React.Dispatch<React.SetStateAction<any>>;
}

const useStyles = makeStyles(theme => ({
  formItem: {
    marginBottom: theme.spacing(2),
  },
  inputPolicy: {
    '& .MuiInputBase-root': {
      fontFamily: "'Fira Code', monospace",
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const RoleDetailsForm: React.FC<Props> = ({
  control,
  errors,
  resources,
  setResources,
  resourcesValid,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // const actionOptions: OptionsType<ActionOptionType> = Object.values(
  //   Action
  // ).map(act => ({
  //   label: getActionName(act),
  //   value: act,
  // }));

  const getActionValue = (rs: Resource): ValueType<ActionOptionType, true> => {
    return resources
      .find(resource => resource.name === rs)!
      .actions.map(act => ({
        label: getActionName(act),
        value: act,
      }));
  };

  // const handleSelectChange = (
  //   actions: ValueType<ActionOptionType[], false>,
  //   { name }: ActionMeta<ActionOptionType>
  // ) => {
  //   const newResources = resources.map(rs => {
  //     const newActions = actions
  //       ? (actions as ActionOptionType[]).map(act => {
  //           return act.value;
  //         })
  //       : [];
  //     if (rs.name === name) {
  //       return { ...rs, actions: newActions };
  //     } else {
  //       return { ...rs };
  //     }
  //   });
  //   setResources(newResources);
  // };

  return (
    <form style={{ width: '100%' }}>
      <Grid container direction='column'>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            name='name'
            control={control}
            isError={Boolean(errors?.name)}
            errorMessage={errors?.name?.message}
            label='Tên quyền'
          />
        </Grid>

        <Grid item className={classes.formItem}>
          <Input
            multiline={true}
            rows={4}
            size='small'
            name='policy'
            control={control}
            isError={Boolean(errors?.policy)}
            errorMessage={errors?.policy?.message}
            label='Policy'
            className={classes.inputPolicy}
            placeholder={t('PLACEHOLDER_SUGGEST_POLICY')}
          />
        </Grid>

        {Object.values(Resource).map(rs => {
          return (
            <Grid item className={classes.formItem} key={rs}>
              <Select
                placeholder={getResourceName(rs)}
                name={rs}
                onChange={(actions, { name }) => {
                  const newResources = resources.map(rs => {
                    const newActions = actions
                      ? actions.map(act => {
                          return act.value;
                        })
                      : [];
                    if (rs.name === name) {
                      return { ...rs, actions: newActions };
                    } else {
                      return { ...rs };
                    }
                  });
                  setResources(newResources);
                }}
                isMulti
                options={Object.values(Action).map(act => ({
                  label: getActionName(act),
                  value: act,
                }))}
                value={getActionValue(rs)}
              />
            </Grid>
          );
        })}

        {!resourcesValid && (
          <Grid item className={classes.formItem}>
            <Typography variant='body2' color='error'>
              {t('MESSAGE_REQUIRE_VALID_RESOURCE')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default RoleDetailsForm;
