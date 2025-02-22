import * as Yup from "yup";
export const AddressSchema = Yup.object().shape({
    firstName:Yup.string().required("First Name is required"),
    lastName:Yup.string().required("Last Name is required"),
    contact:Yup
    .string()
    .matches(/^\d{7,15}$/, "Phone number must be between 7-15 digits")
    .required("Phone number is required"),
    addressline1:  Yup.string().required("Address Line 1 is required"),
    addressline2:  Yup.string(),
    city:  Yup.object().required("City is required"),
    state:Yup.object().required("State is required"),
    country: Yup.object().required("Country is required"),
    postalCode: Yup.string().required("postalCode is required").matches(/^[0-9]{6}$/, "Must be a valid 6-digit postalCode"),
    countryCode: Yup.string().required("Country code is required"),
 } );