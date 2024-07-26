"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function FormPage() {
    const [isChecked, setIsChecked] = useState(false);
    const [formValues, setFormValues] = useState({
        TeamName: "",
        LeaderName: "",
        number: "",
    });
    const [errorMessage, setErrorMessage] = useState({
        TeamName: "",
        LeaderName: "",
        number: "",
        checkbox: "",
        general: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormValues({ ...formValues, [id]: value });
        setErrorMessage({ ...errorMessage, [id]: "" }); // Clear error message when user types
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        setErrorMessage({ ...errorMessage, checkbox: "" }); // Clear error message when user checks the checkbox
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        let valid = true;
        let errors = { ...errorMessage };

        if (formValues.TeamName.trim().length === 0) {
            errors.TeamName = "Team Name is required";
            valid = false;
        }

        if (formValues.LeaderName.trim().length === 0) {
            errors.LeaderName = "Leader Name is required";
            valid = false;
        }

        if (formValues.number.trim().length <= 9) {
            errors.number = "Whatsapp Number must be at least 10 digits";
            valid = false;
        }

        if (!isChecked) {
            errors.checkbox = "You must agree to the terms and conditions";
            valid = false;
        }

        if (!valid) {
            setErrorMessage(errors);
            return;
        }

        // If validation is successful, submit the form
        const formData = new FormData();
        Object.keys(formValues).forEach((key) => {
            formData.append(key, formValues[key as keyof typeof formValues]);
        });

        try {
            const response = await fetch("https://getform.io/f/bdrydvnb", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                setIsSubmitted(true); // Set submission status to true upon successful submission
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setErrorMessage({ ...errorMessage, general: "Error submitting form, please try again." });
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-center text-blue-600 text-4xl mx-2">
                Registration Form
            </h2>
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="TeamName">
                            Team Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="TeamName"
                            name="TeamName"
                            placeholder="Apex"
                            type="text"
                            value={formValues.TeamName}
                            onChange={handleChange}
                        />
                        {errorMessage.TeamName && (
                            <ErrorText>{errorMessage.TeamName}</ErrorText>
                        )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="LeaderName">
                            Leader name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="LeaderName"
                            name="LeaderName"
                            placeholder="Apex Nova"
                            type="text"
                            value={formValues.LeaderName}
                            onChange={handleChange}
                        />
                        {errorMessage.LeaderName && (
                            <ErrorText>{errorMessage.LeaderName}</ErrorText>
                        )}
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="number">
                        Whatsapp Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="number"
                        name="number"
                        placeholder="9876543210"
                        type="text"
                        value={formValues.number}
                        onChange={handleChange}
                    />
                    {errorMessage.number && (
                        <ErrorText>{errorMessage.number}</ErrorText>
                    )}
                </LabelInputContainer>
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="terms" className="ml-2">
                        I agree to the terms and conditions <span className="text-red-500">*</span>
                    </Label>
                </div>
                {errorMessage.checkbox && (
                    <ErrorText>{errorMessage.checkbox}</ErrorText>
                )}
                {errorMessage.general && (
                    <ErrorText>{errorMessage.general}</ErrorText>
                )}
                {isSubmitted && (
                    <SuccessText>Form submitted successfully!</SuccessText>
                )}
                <button
                    className="bg-gradient-to-br text-sm relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Register &rarr;
                    <BottomGradient />
                </button>
            </form>
        </div>
    );
}

const BottomGradient = () => (
    <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
);

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
    </div>
);

const ErrorText = ({ children }: { children: React.ReactNode }) => (
    <div aria-live="assertive" className="text-sm text-red-500 mb-4">{children}</div>
);

const SuccessText = ({ children }: { children: React.ReactNode }) => (
    <div aria-live="polite" className="text-sm text-green-500 mb-4">{children}</div>
);
