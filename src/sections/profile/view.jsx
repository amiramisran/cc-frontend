import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useTheme } from '@emotion/react';
import React, { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Tab,
  Grid,
  Card,
  Tabs,
  Stack,
  Avatar,
  Button,
  MenuItem,
  Container,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { countries } from 'src/assets/data';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
// import { RHFAutocomplete } from 'src/components/hook-form copy';
import FormProvider from 'src/components/hook-form copy/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import UploadPhoto from './dropzone';
import AccountSecurity from './security';

const Profile = () => {
  const settings = useSettingsContext();
  const theme = useTheme();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('general');

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.mixed().nullable().required('Avatar is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    designation: Yup.string().required('Address is required'),
  });

  const defaultValues = {
    name: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    designation: user?.designation || '',
    country: user?.country || '',
    photoURL: user?.photoURL || '',
  };

  const methods = useForm({ defaultValues, resolver: yupResolver(UpdateUserSchema) });
  const { handleSubmit, setValue } = methods;

  const [image, setImage] = useState();

  const onDrop = useCallback(
    (e) => {
      const preview = URL.createObjectURL(e[0]);
      setValue('photoUrl', e[0]);
      setImage(preview);
    },
    [setValue]
  );

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // const handleUpload = async () => {
  //   if (!image) {
  //     alert('Upload image first');
  //     return;
  //   }

  //   await axios.post(
  //     endpoints.auth.upload,
  //     { id: user?.id, image: url },
  //     { headers: { 'content-type': 'multipart/form-data' } }
  //   );
  // };

  const onSubmit = handleSubmit((data) => {
    try {
      alert(JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  });

  const renderPicture = (
    <Grid item xs={12} md={4} lg={4}>
      <Card sx={{ p: 1, textAlign: 'center' }}>
        <Stack alignItems="center" p={3} spacing={2}>
          <UploadPhoto onDrop={onDrop}>
            <Avatar
              sx={{
                width: 1,
                height: 1,
                borderRadius: '50%',
              }}
              src={image || user.photoURL}
            />
          </UploadPhoto>
          <Typography display="block" color={theme.palette.grey['600']} sx={{ fontSize: 12 }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
          </Typography>
          <Button color="error" sx={{ mt: 3, width: '100%' }}>
            Delete
          </Button>
        </Stack>
      </Card>
    </Grid>
  );

  const renderForm = (
    <Grid item xs={12} md={8} lg={8}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 1 }}>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Grid container spacing={2} p={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <RHFTextField name="email" label="Email" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <RHFTextField name="phoneNumber" label="Phone Number" />
              </Grid>
              {/* Change later Add more data */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <RHFSelect name="designation" label="Designation">
                  <MenuItem value="CSM">Customer Success Manager</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <RHFAutocomplete
                  name="country"
                  type="country"
                  label="Country"
                  placeholder="Choose a country"
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} sx={{ textAlign: 'end' }}>
                <LoadingButton type="submit">Save Changes</LoadingButton>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </FormProvider>
    </Grid>
  );

  const tabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      <Tab
        label="General"
        value="general"
        icon={<Iconify icon="solar:user-id-bold" width={24} />}
      />
      <Tab
        label="Security"
        value="security"
        icon={<Iconify icon="ic:round-vpn-key" width={24} />}
      />
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'User',
            href: paths.dashboard.user,
          },
          { name: 'Profile' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {tabs}

      {currentTab === 'security' && <AccountSecurity />}

      {currentTab === 'general' && (
        <Grid container spacing={3}>
          {renderPicture}

          {renderForm}
        </Grid>
      )}
    </Container>
  );
};

export default Profile;