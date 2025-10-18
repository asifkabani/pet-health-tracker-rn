import { useMemo, useState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import { SignInFormErrors } from "@/types/auth";
import { isValidEmail, normalizeEmail, trimText } from "@/util/helpers";

export function useSignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo<SignInFormErrors>(() => {
    const acc: SignInFormErrors = {};
    const trimmedName = trimText(name);
    const normalizedEmail = normalizeEmail(email);
    if (!trimmedName) acc.name = "What's your name?";
    if (!isValidEmail(normalizedEmail)) acc.email = "Enter a valid email.";
    if (password.length < PASSWORD_MIN_LENGTH) {
      acc.password = `Min ${PASSWORD_MIN_LENGTH} characters.`;
    }
    if (!agree) acc.agree = "Please agree to the terms.";
    return acc;
  }, [name, email, password, agree]);

  const valid = Object.keys(errors).length === 0;

  return {
    // state
    name,
    email,
    password,
    showPwd,
    agree,
    loading,
    // setters
    setName,
    setEmail,
    setPassword,
    setLoading,
    toggleShowPwd: () => setShowPwd((s) => !s),
    toggleAgree: () => setAgree((v) => !v),
    // derived
    errors,
    valid,
  };
}

