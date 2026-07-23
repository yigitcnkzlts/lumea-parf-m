"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Adınızı girin."),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  subject: z.string().min(3, "Konu seçin."),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı."),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormValues>();

  const submit = (values: FormValues) => {
    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        setError(field, { message: issue.message });
      }
      return;
    }
    toast.success("Mesajınız alındı. En kısa sürede size döneceğiz.");
    reset();
  };

  const fieldClass = "w-full border-b border-black/20 bg-transparent px-0 py-4 text-sm outline-none focus:border-black";

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-[10px] tracking-widest">ADINIZ
          <input {...register("name")} className={fieldClass} placeholder="Adınız ve soyadınız" />
          {errors.name && <span className="mt-2 block text-xs text-red-700">{errors.name.message}</span>}
        </label>
        <label className="text-[10px] tracking-widest">E-POSTA
          <input {...register("email")} type="email" className={fieldClass} placeholder="ornek@email.com" />
          {errors.email && <span className="mt-2 block text-xs text-red-700">{errors.email.message}</span>}
        </label>
      </div>
      <label className="mt-7 block text-[10px] tracking-widest">KONU
        <select {...register("subject")} className={fieldClass} defaultValue="">
          <option value="" disabled>Konu seçin</option>
          <option>Sipariş ve teslimat</option>
          <option>Ürün danışmanlığı</option>
          <option>İade ve değişim</option>
          <option>Diğer</option>
        </select>
        {errors.subject && <span className="mt-2 block text-xs text-red-700">{errors.subject.message}</span>}
      </label>
      <label className="mt-7 block text-[10px] tracking-widest">MESAJINIZ
        <textarea {...register("message")} rows={5} className={`${fieldClass} resize-none`} placeholder="Size nasıl yardımcı olabiliriz?" />
        {errors.message && <span className="mt-2 block text-xs text-red-700">{errors.message.message}</span>}
      </label>
      <button className="btn-dark mt-8">MESAJI GÖNDER</button>
    </form>
  );
}
