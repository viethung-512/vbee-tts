import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

import Input from 'app/layout/commons/form/Input';
import DateInput from 'app/layout/commons/form/DateInput';
import AutoComplete from 'app/layout/commons/form/AutoComplete';
// import { dialects } from 'app/utils/constants';
import { User } from 'app/types/user';
import { Voice } from 'app/types/voice';
import { DialectType, SentenceType } from '@tts-dev/common';

export interface BroadcasterActionField {
  user: User | string;
  voice: Voice | string;
  dialect: DialectType;
  types: {
    label: string;
    value: SentenceType;
  }[];
  expiredAt: string;
}

interface Props {
  control: Control;
  errors: FieldErrors<BroadcasterActionField>;
  userSearching: boolean;
  voiceSearching: boolean;
  setUserSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setVoiceSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  users: User[];
  voices: Voice[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  broadcasterId?: string;
}

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    width: '15em',
    borderRadius: 24,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

const getTypes = () => {
  return Object.values(SentenceType).map(type => ({
    value: type,
    label: type,
  }));
};

const getDialects = () => {
  return Object.values(DialectType).map(d => {
    if (d === DialectType.HANOI) {
      return {
        value: d,
        label: 'Hà Nội',
      };
    }

    return {
      value: d,
      label: 'Sài Gòn',
    };
  });
};

const types = getTypes();

const dialects = getDialects();

const BroadcasterDetailsForm: React.FC<Props> = ({
  control,
  errors,
  userSearching,
  voiceSearching,
  users,
  voices,
  setUserSearchTerm,
  setUsers,
  setVoiceSearchTerm,
  setVoices,
  broadcasterId,
}) => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();

  return (
    <form style={{ width: '100%' }}>
      <Grid container direction='column'>
        <Grid item className={classes.formItem}>
          <AutoComplete
            name='user'
            isError={Boolean(errors?.user)}
            errorMessage={(errors?.user as any)?.message}
            control={control}
            label={t('MODEL_USER')}
            setTerm={setUserSearchTerm}
            labelField='username'
            options={users}
            setOptions={setUsers}
            loading={userSearching}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <AutoComplete
            name='voice'
            isError={Boolean(errors?.voice)}
            errorMessage={(errors?.voice as any)?.message}
            control={control}
            label={t('FIELDS_VOICE_NAME')}
            setTerm={setVoiceSearchTerm}
            labelField='code'
            options={voices}
            setOptions={setVoices}
            loading={voiceSearching}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_BROADCASTER_DIALECT')}
            select
            name='dialect'
            isError={Boolean(errors?.dialect)}
            errorMessage={errors?.dialect?.message}
            control={control}
          >
            {dialects.map(dialect => (
              <MenuItem key={dialect.value} value={dialect.value}>
                {dialect.label}
              </MenuItem>
            ))}
          </Input>
        </Grid>
        <Grid item className={classes.formItem}>
          <DateInput
            name='expiredAt'
            label={t('expiredAt')}
            control={control}
            isError={Boolean(errors?.expiredAt)}
            errorMessage={errors?.expiredAt?.message}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Controller
            as={Select}
            name='types'
            control={control}
            options={types}
            isMulti
            onChange={([selected]: any) => {
              return { value: selected };
            }}
          />
          {Boolean(errors?.types) && (
            <FormHelperText error={true}>
              {(errors.types as any)?.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default BroadcasterDetailsForm;
