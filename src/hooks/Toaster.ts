// toastUtils.ts or toastUtils.js
"use client";
import toast from "react-hot-toast";

// Notify Success Toast
export const notifySuccess = ({
  title,
  description,
  message,
  toastID,
}: {
  title: string;
  description?: string;
  message: string;
  toastID?: string;
}) => {
  // Combine title and description with message content
  const content = `${title}\n${description}\n${message}`;

  // Show the success toast with custom content
  return toast.success(content, { id: toastID });
};

// Notify Error Toast
export const notifyError = ({
  message,
  toastID,
}: {
  message: string;
  toastID?: string;
}) => {
  // Show the error toast
  return toast.error(message, { id: toastID });
};

// Loading Toast
export const loadingToast = () => toast.loading("Loading...");
