import * as Yup from "yup";

export const userValidation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  hashPassword: Yup.string().when("$mode", {
    is: (mode: string) => mode !== "edit", // required except edit
    then: (schema) =>
      schema
        .required("Password is required")
        .matches(/[A-Z]/, "Must contain uppercase")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[!@#$%^&*]/, "Must contain special character")
        .min(8, "Minimum 8 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  confirmPassword: Yup.string().when("$mode", {
    is: (mode: string) => mode !== "edit",
    then: (schema) =>
      schema
        .required("Confirm Password is required")
        .oneOf([Yup.ref("hashPassword")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const clientSchema = Yup.object({
  availmentDate: Yup
    .string()
    .required("Availment date is required"),

  availmentAmount: Yup
    .number()
    .typeError("Must be a number")
    .required("Amount is required")
    .min(1, "Must be greater than 0"),

  interestAmount: Yup
    .number()
    .typeError("Must be a number")
    .required("Interest is required")
    .min(0, "Cannot be negative"),
});