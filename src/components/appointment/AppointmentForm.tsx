import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { appointmentFormSchema, genderOptions, type AppointmentFormData } from '../../types/appointment';
import { EXACT_SERVICE_NAMES } from '../../config/servicesData';
import { clinicConfig } from '../../config/clinicConfig';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface AppointmentFormProps {
  initialService?: string | null;
  onSuccess: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialService, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Default date to tomorrow formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const initialServices = initialService && EXACT_SERVICE_NAMES.includes(initialService as any)
    ? [initialService]
    : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: '',
      gender: undefined,
      appointmentDate: defaultDateStr,
      contactNumber: '',
      email: '',
      message: '',
      services: initialServices,
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: data.name.trim(),
      gender: data.gender,
      appointmentDate: data.appointmentDate,
      contactNumber: data.contactNumber.trim(),
      email: data.email ? data.email.trim() : undefined,
      message: data.message ? data.message.trim() : undefined,
      services: data.services,
    };

    try {
      const endpoint = clinicConfig.apiBaseUrl
        ? `${clinicConfig.apiBaseUrl.replace(/\/$/, '')}/api/appointments`
        : '/api/appointments';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.message ||
          (errorData?.errors ? Object.values(errorData.errors).flat().join(' ') : null) ||
          'Failed to record appointment on server. Please try again.';
        throw new Error(errorMsg);
      }

      setIsSubmitting(false);
      onSuccess();
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to send request. Please check your connection or call us directly.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Basic Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          required
          placeholder="e.g. Muhammad Ali"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Gender Dropdown */}
        <Select
          label="Gender"
          required
          placeholder="Select gender"
          options={genderOptions.map((g) => ({ label: g, value: g }))}
          error={errors.gender?.message}
          {...register('gender')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Appointment */}
        <Input
          label="Preferred Appointment Date"
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          error={errors.appointmentDate?.message}
          {...register('appointmentDate')}
        />

        {/* Contact Number */}
        <Input
          label="Contact Number (Mobile / WhatsApp)"
          type="tel"
          required
          placeholder="e.g. +92 300 1234567"
          error={errors.contactNumber?.message}
          {...register('contactNumber')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="e.g. patient@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Short Message / Notes */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="message-input" className="block text-sm font-medium text-slate-800">
            Message / Specific Concerns (Optional)
          </label>
          <textarea
            id="message-input"
            rows={1}
            placeholder="e.g., Tooth pain on upper left side, preferred morning time..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all resize-none"
            {...register('message')}
          />
        </div>
      </div>

      {/* Services Checklist - STRICT REQUIRED ORDER */}
      <div className="pt-2">
        <div className="flex justify-between items-baseline mb-2">
          <label className="block text-sm font-semibold text-slate-900">
            Select Required Service(s) <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <span className="text-xs text-slate-500">Select one or more treatments</span>
        </div>

        <Controller
          name="services"
          control={control}
          render={({ field }) => {
            const currentSelected: string[] = field.value || [];

            const handleToggle = (serviceName: string) => {
              if (currentSelected.includes(serviceName)) {
                field.onChange(currentSelected.filter((s) => s !== serviceName));
              } else {
                field.onChange([...currentSelected, serviceName]);
              }
            };

            return (
              <div className="space-y-1.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                  {EXACT_SERVICE_NAMES.map((serviceName, index) => {
                    const isChecked = currentSelected.includes(serviceName);
                    return (
                      <label
                        key={serviceName}
                        className={`flex items-start gap-2.5 p-2.5 rounded-md border text-xs sm:text-sm cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-teal-50/90 border-teal-600 text-teal-950 font-medium shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={serviceName}
                          checked={isChecked}
                          onChange={() => handleToggle(serviceName)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                        />
                        <span className="leading-tight">
                          <span className="text-slate-400 font-mono text-[10px] mr-1">#{index + 1}</span>
                          {serviceName}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {errors.services && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {errors.services.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Confidentiality & Security Notice */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/70 p-2.5 rounded-md">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
        <span>Your health information is strictly confidential and protected.</span>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full shadow-lg"
          isLoading={isSubmitting}
        >
          Submit Appointment Request
        </Button>
      </div>
    </form>
  );
};
