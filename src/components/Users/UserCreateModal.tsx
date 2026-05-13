import Modal from "@components/Common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "./Input";
import { useEffect } from "react";
import { createUser, updateUser } from "@api/users";
import { Select } from "./Select";
import { Toggle } from "./Toggle";
import { showToast } from "@utils/toast";

/* ✅ FIXED ROLES */
type RoleOption = "SUPER_ADMIN" | "DEV" | "PROVIDER";

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    onSuccess?: () => void;
    mode?: "create" | "edit";
    initialData?: {
        _id?: string; // ✅ FIXED
        fullName: string;
        email: string;
        role: RoleOption;
        isActive?: boolean;
    };
};

function UserCreateModal({
    open,
    setOpen,
    onSuccess,
    mode = "create",
    initialData,
}: Props) {
    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            role: "PROVIDER" as RoleOption,
            isActive: false,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required("Full name is required")
                .min(3, "Name must be at least 3 characters")
                .max(50, "Name must be under 50 characters"),
            email: Yup.string()
                .email("Invalid email id")
                .required("Email is required")
                .min(5, "Email is too short")
                .max(100, "Email must be under 100 characters"),
            role: Yup.string().required("Role is required"),
            isActive: Yup.boolean().optional(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (mode === "edit" && initialData?._id) {
                    await updateUser(initialData._id, {
                        fullName: values.fullName,
                        email: values.email,
                        role: values.role,
                        isActive: values.isActive,  // ✅ now supported
                    });
                    showToast("User updated successfully")
                } else {
                    await createUser({
                        fullName: values.fullName,
                        email: values.email,
                        role: values.role,
                    });
                    showToast("User created successfully")
                }

                onSuccess?.();
                setOpen(false);
            } catch (err: any) {
                console.error(err);
                alert(err.message || "Operation failed"); // ✅ FIXED
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (open && initialData) {
            formik.setValues({
                fullName: initialData.fullName,
                email: initialData.email,
                role: initialData.role,
                isActive: initialData.isActive || false,
            });
        }

        if (!open) {
            formik.resetForm();
        }
    }, [open, initialData]);

    return (
        <Modal
            open={open}
            title={mode === "edit" ? "Edit User" : "Create User"}
            subtitle={
                mode === "edit"
                    ? "Update user details"
                    : "Enter details to invite a new user"
            }
            onCancel={() => setOpen(false)}
            onConfirm={() => formik.handleSubmit()}
            confirmText={mode === "edit" ? "Update User" : "Create User"}
        >
            <form className="flex flex-col gap-4">
                <Input
                    label="Full Name"
                    name="fullName"
                    value={formik.values.fullName}
                    // onChange={formik.handleChange}
                    onChange={(e) => {
                        const value = e.target.value;

                        const cleaned = value.replace(/[^a-zA-Z0-9 ]/g, "");
                        formik.setFieldValue("fullName", cleaned);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.errors.fullName}
                    touched={formik.touched.fullName}
                    placeholder="Enter full name"
                    maxLength={50}
                />

                <Input
                    label="Email Address"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                    placeholder="Enter email"
                    maxLength={100}
                />

                {/* ✅ UPDATED ROLES */}
                <Select
                    label="Role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                        { label: "Super Admin", value: "SUPER_ADMIN" },
                        // { label: "Developer", value: "DEV" },
                        { label: "Provider", value: "PROVIDER" },
                    ]}
                    error={formik.errors.role as string}
                    touched={formik.touched.role}
                />

                {/* ✅ EDIT ONLY */}
                {mode === "edit" && (
                    <Toggle
                        label="Account Status"
                        checked={formik.values.isActive}
                        onChange={(checked) =>
                            formik.setFieldValue(
                                "isActive",
                                checked
                            )
                        }
                    />
                )}
            </form>
        </Modal>
    );
}

export default UserCreateModal;