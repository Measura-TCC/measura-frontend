import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import measuraLogo from "@/presentation/assets/images/measura-logo.png";

export const LoginHeader: React.FC = () => {
  const { t } = useTranslation("login");

  return (
    <div className="text-center">
      <Link href="/" className="inline-block">
        <Image src={measuraLogo} alt="Measura" width={125} height={125} />
      </Link>
      <p className="text-muted text-lg">{t("subtitle")}</p>
    </div>
  );
};
