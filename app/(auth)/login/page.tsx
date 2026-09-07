"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: t("invalidCredentials"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("loginSuccess"),
          description: "Welcome back!",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: t("loginFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-enter w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/65 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          FitLife Pro
        </h1>
        <p className="text-slate-400">Welcome back. Let’s continue your routine.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("loading") : t("signIn")}
        </Button>
      </form>

      <p className="text-center text-slate-400 mt-6">
        {t("dontHaveAccount")}{" "}
        <a href="/register" className="text-primary hover:underline">
          {t("createAccount")}
        </a>
      </p>

      <div className="mt-8 rounded-lg border border-slate-700/70 bg-slate-800/60 p-3 text-center text-sm text-slate-400">
        <p className="mb-2">Demo Credentials:</p>
        <p>Admin: admin@fitlifepro.com / admin123</p>
        <p>Trainer: trainer@fitlifepro.com / trainer123</p>
        <p>Member: amit@example.com / member123</p>
      </div>
    </div>
  );
}
