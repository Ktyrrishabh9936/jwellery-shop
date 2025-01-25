import * as Yup from "yup";
export const AddressSchema = Yup.object().shape({
    selectedDetails:Yup.string(),
    firstName:Yup.string().required("First Name is required"),
    lastName:Yup.string().required("Last Name is required"),
    contact:Yup.string().required("Contact Number is required").matches(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
    street:  Yup.string().required("Address Line 1 is required"),
    city:  Yup.string().required("City is required"),
    state:Yup.string().required("State is required"),
    postalCode: Yup.string().required("postalCode is required").matches(/^[0-9]{6}$/, "Must be a valid 6-digit postalCode"),
    landmark: Yup.string(),
  });