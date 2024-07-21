import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import { Box, Chip, Stack, Avatar, MenuItem, Typography, ListItemText } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { RHFSelect } from 'src/components/hook-form';
import Markdown from 'src/components/markdown/markdown';
import FormProvider from 'src/components/hook-form/form-provider';

const CampaignDetailPitchContent = ({ data }) => {
  const methods = useForm({
    defaultValues: {
      status: data?.status || '',
      pitchId: data?.id || '',
    },
  });

  const { setValue, getValues } = methods;

  useEffect(() => {
    setValue('status', data?.status);
    setValue('pitchId', data?.id);
  }, [setValue, data]);

  const handleChange = async (val) => {
    setValue('status', val.target.value);
    const values = getValues();

    try {
      const res = await axiosInstance.patch(endpoints.campaign.pitch.changeStatus, values);
      enqueueSnackbar(res?.data?.message);
    } catch (error) {
      enqueueSnackbar('error', {
        variant: 'error',
      });
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" gap={2} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center" flexGrow={1}>
          <Avatar alt={data?.user?.name} src={data?.user?.photoURL} />
          <Typography>{data?.user?.name}</Typography>
          <Iconify icon="mdi:tick-decagram" color="success.main" />
        </Stack>

        <FormProvider methods={methods}>
          <RHFSelect
            size="small"
            label="Status"
            name="status"
            sx={{ width: 150 }}
            onChange={(e, val) => handleChange(e)}
          >
            <MenuItem value="undecided">
              <Stack direction="row" alignItems="center">
                <Iconify icon="mdi:dot" width={30} />
                Undecided
              </Stack>
            </MenuItem>
            <MenuItem value="filtered">
              <Stack direction="row" alignItems="center">
                <Iconify icon="mdi:dot" width={30} color="warning.main" />
                Filtered
              </Stack>
            </MenuItem>
            <MenuItem value="approved">
              <Stack direction="row" alignItems="center">
                <Iconify icon="mdi:dot" color="success.main" width={30} />
                Approved
              </Stack>
            </MenuItem>
            <MenuItem value="rejected">
              <Stack direction="row" alignItems="center">
                <Iconify icon="mdi:dot" color="error.main" width={30} />
                Rejected
              </Stack>
            </MenuItem>
          </RHFSelect>
          {/* </FormControl> */}
        </FormProvider>
      </Stack>
      <Box display="flex" flexDirection="column">
        <Typography variant="h6">Profile</Typography>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={2}
          mt={1.5}
        >
          <ListItemText
            primary="Name"
            secondary={data?.user?.name}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />
          <ListItemText
            primary="Email"
            secondary={data?.user?.email}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />
          <ListItemText
            primary="Age"
            secondary={`${dayjs().get('year') - dayjs(data?.user?.creator?.birthDate).get('year')} years old`}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />
          <ListItemText
            primary="Languages"
            secondary={data?.user?.creator?.languages.map((elem) => (
              <Chip label={elem} size="small" sx={{ mr: 1 }} />
            ))}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />
          <ListItemText
            primary="Pronounce"
            secondary={data?.user?.creator?.pronounce}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />

          <ListItemText
            primary="Employement Type"
            secondary={data?.user?.creator?.employment}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />

          <ListItemText
            primary="Interests"
            secondary={
              <Stack gap={1} direction="row" flexWrap="wrap">
                {data?.user?.creator?.interests.map((elem) => (
                  <Chip size="small" label={elem?.name} />
                ))}
              </Stack>
            }
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />

          <ListItemText
            primary="Industries"
            secondary={
              <Stack gap={1} direction="row" flexWrap="wrap">
                {data?.user?.creator?.industries.map((elem, index) => (
                  <Chip key={index} size="small" label={elem?.name} />
                ))}
              </Stack>
            }
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />

          <ListItemText
            primary="Instagram"
            secondary={data?.user?.creator?.instagram}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />

          <ListItemText
            primary="Tiktok"
            secondary={data?.user?.creator?.tiktok}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle2',
            }}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Typography variant="h6">Pitch</Typography>

        <Box
          // display="grid"
          // gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          // gap={2}
          mt={1.5}
        >
          {data?.type === 'text' ? (
            <Markdown children={data?.content} />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              autoPlay
              style={{ width: '100%', borderRadius: 10, margin: 'auto' }}
              key={data?.content}
              controls
            >
              <source src={data?.content} />
            </video>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default CampaignDetailPitchContent;

CampaignDetailPitchContent.propTypes = {
  data: PropTypes.object,
};
