import { useForm } from "react-hook-form";
import { Send, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button, Input, Textarea } from "@/components/atoms";
import { sendContactMessage, type ContactPayload } from "@/api";
import { FormField, SpinningLoader } from "@/components/molecules";

export const ContactForm = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactPayload>();

  const {
    mutate,
    isPending,
    isSuccess,
    reset: resetMutation,
  } = useMutation({
    mutationFn: sendContactMessage,
  });

  const onReset = () => {
    resetMutation();
    reset();
  };

  const onMutateContact = (data: ContactPayload) => mutate(data);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 border border-green-300 dark:bg-green-400/20 dark:border-green-400/30">
          <CheckCircle2 className="size-8 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Message sent!
        </h3>
        <p className="text-gray-500 dark:text-white/60 max-w-xs">
          Thanks for reaching out. We'll get back to you within 24 hours.
        </p>
        <Button
          variant="ghost"
          onClick={onReset}
          className="mt-2 text-sm text-capitec-blue underline-offset-4 hover:underline dark:text-blue-300"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onMutateContact)} className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Send us a message
        </h2>

        <FormField id="name" label="Full name" error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            disabled={isPending}
            {...register("name", { required: "Full name is required" })}
          />
        </FormField>

        <FormField
          id="email"
          label="Email address"
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            disabled={isPending}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </FormField>

        <FormField id="message" label="Message" error={errors.message?.message}>
          <Textarea
            id="message"
            rows={5}
            placeholder="How can we help you?"
            aria-invalid={!!errors.message}
            disabled={isPending}
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
          />
        </FormField>

        <Button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-capitec-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-capitec-blue/90 focus-visible:ring-2 focus-visible:ring-capitec-blue/40 dark:bg-white dark:text-capitec-blue dark:hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              Sending...
              <SpinningLoader
                size={16}
                className="text-white dark:text-capitec-blue"
              />
            </>
          ) : (
            <>
              Send Message
              <Send className="size-4" />
            </>
          )}
        </Button>
      </form>

      {isPending && (
        <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-black/30 flex items-center justify-center">
          <SpinningLoader
            size={40}
            className="text-capitec-blue dark:text-white"
          />
        </div>
      )}
    </div>
  );
};
