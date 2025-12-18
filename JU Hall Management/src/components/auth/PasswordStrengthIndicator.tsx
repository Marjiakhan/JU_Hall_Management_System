import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { validatePassword } from "@/lib/passwordValidation";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const validation = useMemo(() => validatePassword(password), [password]);
  const strength = useMemo(() => {
    if (!password) return 0;
    const passed = Object.values(validation.checks).filter(Boolean).length;
    return Math.round((passed / 6) * 100);
  }, [password, validation.checks]);

  if (!password) return null;

  const requirements = [
    { key: "minLength", label: "At least 8 characters", met: validation.checks.minLength },
    { key: "hasUppercase", label: "Uppercase letter (A-Z)", met: validation.checks.hasUppercase },
    { key: "hasLowercase", label: "Lowercase letter (a-z)", met: validation.checks.hasLowercase },
    { key: "hasNumber", label: "Number (0-9)", met: validation.checks.hasNumber },
    { key: "hasSpecial", label: "Special character (!@#$%^&*)", met: validation.checks.hasSpecial },
    { key: "noSpaces", label: "No spaces", met: validation.checks.noSpaces },
  ];

  const getStrengthColor = () => {
    if (strength < 34) return "bg-destructive";
    if (strength < 67) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength < 34) return "Weak";
    if (strength < 67) return "Medium";
    if (strength < 100) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", getStrengthColor())}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground min-w-[50px]">{getStrengthLabel()}</span>
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => (
          <div
            key={req.key}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              req.met ? "text-green-500" : "text-muted-foreground"
            )}
          >
            {req.met ? (
              <Check className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>

      {/* Warning Message */}
      {!validation.isValid && (
        <p className="text-xs text-muted-foreground">
          {validation.message}
        </p>
      )}
    </div>
  );
}
