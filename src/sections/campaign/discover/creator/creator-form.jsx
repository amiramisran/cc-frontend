import React from 'react';
import * as yup from 'yup';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { banks } from 'src/contants/bank';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

const CreatorForm = ({ dialog, user, display, backdrop }) => {
  const schema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    address: yup.string().required('Address is required'),
    icNumber: yup.string().required('IC/Passport number is required'),
    bankName: yup.string().required('Bank Name is required'),
    accountName: yup.string().required('Account Name is required'),
    accountNumber: yup.string().required('Account Number is required'),
  });

  const loading = useBoolean();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.name || '',
      address: user?.creator?.location || '',
      icNumber: user?.paymentForm?.icNumber || '',
      bankName: user?.paymentForm?.bankName || '',
      accountName: user?.name || '',
      accountNumber: user?.paymentForm?.bankAccountNumber || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      loading.onTrue();
      const res = await axiosInstance.patch(endpoints.creators.updateCreatorform, {
        ...data,
        userId: user?.id,
      });
      enqueueSnackbar(res?.data?.message);
      dialog.onFalse();
      backdrop?.onFalse();
      mutate(endpoints.auth.me);
    } catch (error) {
      enqueueSnackbar('error', {
        variant: 'error',
      });
    } finally {
      loading.onFalse();
    }
  });

  return display ? (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        gap={1}
        mt={2}
      >
        <RHFTextField name="fullName" label="Full name" />
        <RHFTextField name="address" label="Full Address" multiline />
        <RHFTextField name="icNumber" label="IC/Passport Number" />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Bank Details</Typography>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          gap={1}
          mt={2}
        >
          <RHFAutocomplete
            label="Choose a bank"
            name="bankName"
            options={banks.map((item) => item.bank)}
            getOptionLabel={(option) => option}
          />
          {/* <RHFTextField name="bankName" label="Bank name" /> */}
          <RHFTextField name="accountName" label="Name on Account" />
          <RHFTextField name="accountNumber" label="Account Number" />
        </Box>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="end" spacing={2} mt={3}>
        <Button
          size="medium"
          variant="outlined"
          onClick={backdrop?.onFalse}
          sx={{
            minWidth: 120,
            borderColor: 'grey.400',
            color: 'grey.600',
            '&:hover': {
              borderColor: 'grey.500',
              bgcolor: 'grey.50',
            },
          }}
        >
          Later
        </Button>
        <LoadingButton
          size="medium"
          variant="contained"
          type="submit"
          loading={loading.value}
          sx={{
            minWidth: 120,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Submit
        </LoadingButton>
      </Stack>
    </FormProvider>
  ) : (
    <Dialog open={dialog.value} onClose={dialog.onFalse} maxWidth="sm" fullWidth>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Complete This Form</DialogTitle>
        <DialogContent>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            gap={1}
            mt={2}
          >
            <RHFTextField name="fullName" label="Full name" />
            <RHFTextField name="address" label="Address" multiline />
            <RHFTextField name="icNumber" label="IC/Passport Number" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Bank Details</Typography>
            <Box
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              gap={1}
              mt={2}
            >
              <RHFAutocomplete
                label="Choose a bank"
                name="bankName"
                options={banks.map((item) => item.bank)}
                getOptionLabel={(option) => option}
              />
              {/* <RHFTextField name="bankName" label="Bank name" /> */}
              <RHFTextField name="accountName" label="Name on Account" />
              <RHFTextField name="accountNumber" label="Account Number" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            size="medium"
            variant="outlined"
            onClick={dialog.onFalse}
            sx={{
              minWidth: 120,
              borderColor: 'grey.400',
              color: 'grey.600',
              '&:hover': {
                borderColor: 'grey.500',
                bgcolor: 'grey.50',
              },
            }}
          >
            Close
          </Button>
          <LoadingButton
            size="medium"
            variant="contained"
            type="submit"
            loading={loading.value}
            sx={{
              minWidth: 120,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default CreatorForm;

CreatorForm.propTypes = {
  dialog: PropTypes.object,
  user: PropTypes.object,
  display: PropTypes.bool,
  backdrop: PropTypes.object,
};
