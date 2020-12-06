import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RoleDetailsHeader from '../components/RoleDetailsHeader';
import { Role, RoleResource } from 'app/types/role';
import RoleDetailsForm, {
  RoleActionField,
} from '../components/RoleDetailsForm';
import { createRoleValidator } from 'app/utils/validators';
import roleAPI from 'app/api/roleAPI';
import { Resource } from '@tts-dev/common';
import useMutation from 'hooks/useMutation';

interface Props {
  history: RouteComponentProps['history'];
  roleId: string;
}

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const defaultValues: RoleActionField = {
  name: '',
  policy: '',
};

const RoleDetailsContainer: React.FC<Props> = ({ history, roleId }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [role, setRole] = useState<Role>();
  const [fetchRoleLoading, setFetchRoleLoading] = useState(false);
  const {
    control,
    formState,
    errors,
    handleSubmit,
    reset,
    setError,
  } = useForm<RoleActionField>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(createRoleValidator),
  });
  const [resources, setResources] = useState<RoleResource[]>([
    { name: Resource.USER, actions: [] },
    { name: Resource.ROLE, actions: [] },
    { name: Resource.SENTENCE, actions: [] },
    { name: Resource.RECORD, actions: [] },
  ]);
  const { doRequest: createRole, loading: createRoleLoading } = useMutation<
    RoleActionField,
    Role
  >(roleAPI.createRole, setError, () => {
    history.push('/roles');
  });
  const { doRequest: updateRole, loading: updateRoleLoading } = useMutation<
    RoleActionField,
    Role
  >(roleAPI.updateRole, setError, () => {
    history.push('/roles');
  });

  useEffect(() => {
    let active = true;

    const fetchUser = async (id: string) => {
      setFetchRoleLoading(true);
      try {
        const fetchedRole = await roleAPI.getRole(id);

        const newResources = resources.map(rs => {
          const resourceMatch = fetchedRole.resources.find(
            resource => resource.name === rs.name
          );

          if (resourceMatch) {
            return { ...rs, actions: resourceMatch.actions };
          } else {
            return { ...rs };
          }
        });
        const formValues = {
          name: fetchedRole.name,
          policy: fetchedRole.policy.official_version || '',
        };

        reset(formValues);
        setRole(fetchedRole);
        setResources(newResources);
        setFetchRoleLoading(false);
      } catch (err) {
        console.log(err);
        setFetchRoleLoading(false);
      }
    };

    if (active && roleId) {
      fetchUser(roleId);
    }

    return () => {
      active = false;
      reset(defaultValues);
    };

    // eslint-disable-next-line
  }, [roleId]);

  const submitForm = handleSubmit(async values => {
    if (roleId) {
      await updateRole(roleId, {
        name: values.name,
        policy: values.policy,
        resources: resources,
      });
    } else {
      await createRole({
        name: values.name,
        policy: values.policy,
        resources: resources,
      });
    }
  });

  const submitting = createRoleLoading || updateRoleLoading;

  const resourcesValid = resources.every(rs => rs.actions.length === 0)
    ? false
    : true;

  return (
    <Grid container direction='column' alignItems='center'>
      <Grid item container className={classes.toolbar}>
        <RoleDetailsHeader
          submitForm={submitForm}
          loading={fetchRoleLoading}
          roleId={roleId}
          isValid={formState.isValid && resourcesValid}
          submitting={submitting}
          role={role}
        />
      </Grid>

      <Grid item container>
        <Accordion style={{ width: '100%' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='body1'>{t('MESSAGE_BASIC_INFO')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RoleDetailsForm
              control={control}
              errors={errors}
              resources={resources}
              setResources={setResources}
              resourcesValid={resourcesValid}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default RoleDetailsContainer;
