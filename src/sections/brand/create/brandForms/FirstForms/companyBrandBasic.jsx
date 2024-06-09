import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import { alpha } from '@mui/material/styles';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip, IconButton, Autocomplete } from '@mui/material';

import useGetCompany from 'src/hooks/use-get-company';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import CreateCompany from './create-company';

const intersList = [
  'Art',
  'Beauty',
  'Business',
  'Fashion',
  'Fitness',
  'Food',
  'Gaming',
  'Health',
  'Lifestyle',
  'Music',
  'Sports',
  'Technology',
  'Travel',
];
const steps = ['Select or Create Company', 'Fill in Brand Information'];

dayjs.extend(localizedFormat);

function CompanyBrandBasic() {
  const [activeStep, setActiveStep] = useState(0);
  const { companies, getCompany } = useGetCompany();
  const [openCreate, setOpenCreate] = useState();

  useEffect(() => {
    getCompany();
  }, [openCreate, getCompany]);

  // If existing company is selected
  const schemaTwo = Yup.object().shape({
    brandName: Yup.string().required('name is required'),
    brandEmail: Yup.string().required('Email is required'),
    brandPhone: Yup.string().required('Phone is required'),
    brandWebsite: Yup.string().required('Website is required'),
    brandAbout: Yup.string().required('About Description is required'),
    brandObjectives: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().required('Value is required'),
      })
    ),
    brandRegistrationNumber: Yup.string().required('RegistrationNumber is required'),
    brandInstagram: Yup.string().required('Brand Instagram is required'),
    brandTiktok: Yup.string().required('Brand Tiktok is required'),
    brandFacebook: Yup.string().required('Brand Facebook is required'),
    brandIntersts: Yup.array().min(3, 'Brand Interests is required'),
    brandIndustries: Yup.array().min(3, 'Brand Industries is required'),
    companyId: Yup.string().required('Company is required'),
  });

  const defaultValuesOne = {
    brandName: '',
    brandEmail: '',
    brandWebsite: '',
    brandAbout: '',
    companyId: '',
    brandObjectives: [
      {
        value: '',
      },
    ],
    brandInstagram: '',
    brandTiktok: '',
    brandFacebook: '',
    brandIntersts: [],
    brandIndustries: [],
    brandRegistrationNumber: '',
  };

  const methods = useForm({
    resolver: yupResolver(schemaTwo),
    defaultValues: defaultValuesOne,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    register,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'brandObjectives',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post(endpoints.company.createBrand, data);
      enqueueSnackbar('Brand created !! 😀 ', { variant: 'success' });
      setActiveStep((prevActiveStep) => prevActiveStep - 2);
      reset();
    } catch (error) {
      enqueueSnackbar('Failed to create brand', { variant: 'error' });
    }
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const finalSubmit = async (data) => {
    console.log('final', data);
  };

  const onSelectCompany = (item) => {
    setValue('companyId', item?.id);
  };

  function companyInfo() {
    const selectCompany = (
      <Stack gap={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setOpenCreate(true);
          }}
          sx={{
            width: 200,
            p: 1,
            ml: 'auto',
          }}
        >
          Create a new company
        </Button>
        <Controller
          name="companyId"
          control={control}
          render={(item) => (
            <Autocomplete
              {...item.fields}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select a company"
                  error={errors?.companyId}
                  helperText={errors?.companyId && errors.companyId?.message}
                />
              )}
              options={companies && companies}
              getOptionLabel={(option) => option?.name}
              onChange={(e, val) => onSelectCompany(val)}
              renderOption={(field, option) => (
                <Stack direction="row" alignItems="center" {...field} gap={2}>
                  {/* <img loading="lazy" width="20" src={option?.logo_url} alt="" /> */}
                  <Typography>{option?.name}</Typography>
                </Stack>
              )}
            />
          )}
        />
      </Stack>
    );

    // const createCompany = (
    //   <>
    //     <Box
    //       rowGap={2}
    //       columnGap={3}
    //       display="grid"
    //       mt={1}
    //       gridTemplateColumns={{
    //         xs: 'repeat(1, 1fr)',
    //         sm: 'repeat(2, 1fr)',
    //       }}
    //     >
    //       <Box sx={{ flexGrow: 1 }} />
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           flexDirection: 'column',
    //           gap: 2,
    //           p: 1,
    //           gridColumn: '1 / -1',
    //         }}
    //       >
    //         <UploadPhoto onDrop={onDrop}>
    //           <Avatar
    //             sx={{
    //               width: 1,
    //               height: 1,
    //               borderRadius: '50%',
    //             }}
    //             src={image || null}
    //           />
    //         </UploadPhoto>
    //         <Typography variant="h6">Company Logo</Typography>
    //       </Box>

    //       <RHFTextField key="companyName" name="companyName" label="Company Name" />
    //       <RHFTextField key="companyEmail" name="companyEmail" label="Company Email" />
    //       <RHFTextField key="companyPhone" name="companyPhone" label="Company Phone" />
    //       <RHFTextField key="companyAddress" name="companyAddress" label="Company Address" />
    //       <RHFTextField key="companyWebsite" name="companyWebsite" label="Company Website" />
    //       <RHFTextField key="companyAbout" name="companyAbout" label="Company About" />
    //       <RHFTextField
    //         key="companyRegistrationNumber"
    //         name="companyRegistrationNumber"
    //         label="Company Registration Number"
    //       />
    //     </Box>
    //     <Stack direction="row" gap={2} justifyContent="end" p={2}>
    //       <Button color="error">Cancel</Button>
    //       <Button color="primary">Create</Button>
    //     </Stack>
    //   </>
    // );

    return (
      <Stack direction="column" gap={5}>
        {selectCompany}
      </Stack>
    );
  }

  function brandInfo() {
    return (
      <>
        <Box
          rowGap={2}
          columnGap={3}
          display="grid"
          mt={1}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              mt: 3,
            }}
          >
            {' '}
            Brand Information
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <RHFTextField key="brandName" name="brandName" label="Brand  Name" />
          <RHFTextField key="brandEmail" name="brandEmail" label="Brand Email" />
          <RHFTextField key="brandPhone" name="brandPhone" label="Brand  Phone" />
          <RHFTextField key="brandAbout" name="brandAbout" label="Brand  About" />

          <RHFTextField
            key="brandRegistrationNumber"
            name="brandRegistrationNumber"
            label="Brand  Registration Number"
          />
          <RHFAutocomplete
            key="brandIntersts"
            name="brandIntersts"
            placeholder="+ Brand Interests"
            multiple
            freeSolo="true"
            disableCloseOnSelect
            options={intersList.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          <RHFAutocomplete
            key="brandIndustries"
            name="brandIndustries"
            placeholder="+ Brand Industries"
            multiple
            freeSolo="true"
            disableCloseOnSelect
            options={intersList.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Box>
        <Stack mt={5}>
          <Typography variant="h5">Social Media</Typography>

          <Stack
            direction="row"
            spacing={3}
            my={2}
            sx={{
              flexWrap: {
                xs: 'wrap',
                md: 'nowrap',
              },
            }}
          >
            <RHFTextField key="brandInstagram" name="brandInstagram" label="Instagram" />
            <RHFTextField key="brandTiktok" name="brandTiktok" label="Tiktok" />
            <RHFTextField key="brandFacebook" name="brandFacebook" label="Facebook" />
            <RHFTextField key="brandWebsite" name="brandWebsite" label=" Website" />
          </Stack>
        </Stack>

        <Stack mt={5}>
          <Typography variant="h5">Objectives</Typography>

          <Stack
            direction="column"
            spacing={3}
            my={2}
            sx={{
              flexWrap: {
                xs: 'wrap',
                md: 'nowrap',
              },
            }}
          >
            {fields.map((field, index) => (
              <Stack direction="row" gap={1} alignItems="center">
                <TextField
                  fullWidth
                  key={field.id}
                  name={`brandObjectives[${index}]`}
                  label={`Objective ${index + 1}`}
                  {...register(`brandObjectives.${index}.value`)}
                  error={errors?.brandObjectives && errors?.brandObjectives[index]}
                  helperText={
                    errors?.brandObjectives &&
                    errors?.brandObjectives[index] &&
                    errors?.brandObjectives[index]?.value?.message
                  }
                />
                <Tooltip title={`Remove objective ${index + 1}`}>
                  <IconButton onClick={() => remove(index)}>
                    <Iconify icon="material-symbols:remove" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={() => append({ value: '' })}>
              Add Objective
            </Button>
          </Stack>
        </Stack>
      </>
    );
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return companyInfo();
      case 1:
        return brandInfo();
      default:
        return 'Unknown step';
    }
  }

  return (
    <Box
      sx={{
        borderRadius: '20px',
        mt: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Stepper
        sx={{
          pt: 2,
          m: 2,
          my: 5,
        }}
        activeStep={activeStep}
        alternativeLabel
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          // labelProps.error = stepError.includes(index) && true;
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
          </Paper>

          <Box sx={{ display: 'flex', m: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>

            <Box sx={{ flexGrow: 1 }} />
            <Button
              onClick={() => {
                //   reset();
                setActiveStep((prevActiveStep) => prevActiveStep - 2);
              }}
            >
              Reset
            </Button>
            <Button onClick={finalSubmit} color="inherit">
              Submit
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            sx={{
              p: 0.5,
              my: 0.5,
              mx: 1,
              // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),

              width: '80%',
            }}
          >
            <Box sx={{ my: 1 }}>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                {getStepContent(activeStep)}
              </FormProvider>
              <CreateCompany setOpenCreate={setOpenCreate} openCreate={openCreate} set={setValue} />
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', m: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={onSubmit}>
                Submit
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CompanyBrandBasic;
